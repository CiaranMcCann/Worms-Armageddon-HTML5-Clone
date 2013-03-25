/**
 *  
 * Lobby.js
 *
 *  License: Apache 2.0
 *  author:  Ciarán McCann
 *  url: http://www.ciaranmccann.me/
 */

///<reference path="../gui/LobbyMenu.ts"/>
///<reference path="../Game.ts"/>
///<reference path="Client.ts"/>
///<reference path="Events.ts"/>
///<reference path="GameLobby.ts"/>
declare var Util;
declare var server;
declare var require;


// Had to give up the benfits of types in this instance, as a problem with the way ES6 proposal module system
// works with Node.js modules. http://stackoverflow.com/questions/13444064/typescript-conditional-module-import-export
try
{
    var check = require('validator').check;
    var sanitize = require('validator').sanitize;
    var curl = require('node-curl');

//This is some mega hacky stuff, but its the only way I can get around a very strange typescript static anaylse error which
// prevents the project from compling.
    eval("var GameLobby = require('./GameLobby');var Events = require('./Events'); " +
        " var ServerSettings = require('./ServerSettings'); var ServerUtilies = require('./ServerUtilies'); " +
        "var Util = require('util');var server = require('./Server'); var server = require('./server'); ")
} catch (error) { }



class Lobby
{
    private gameLobbies;

    //This is used on the client side and is a reference 
    // to the game lobby the client is attached to.
    client_GameLobby: GameLobby;

    menu: LobbyMenu;
    userCount: number;
    highestUserCount: number;

    constructor()
    {
        this.userCount = 0;
        this.gameLobbies = {};
        this.client_GameLobby = new GameLobby(null, null);
    }

    onConnection(socket, io)
    {
        this.userCount++;
        if (this.userCount > this.highestUserCount)
        {
            this.highestUserCount = this.userCount;
        }

        //When any user connects to the node server we set their socket an ID
        //so we can idefnitny them unqine in their dealings with the server
        var token = ServerUtilies.createToken() + this.userCount;
        socket.set('userId', token, function () =>
        {
            io.log.info(Util.format("User connected and assigned ID " + token + " from " + socket.handshake.address.address));
        });

        socket.emit(Events.client.ASSIGN_USER_ID, token);

        io.sockets.emit(Events.lobby.UPDATE_USER_COUNT, this.userCount);

        // When someone makes a connection send them the lobbie
        socket.emit(Events.client.UPDATE_ALL_GAME_LOBBIES, JSON.stringify(this.getGameLobbies()));
    }


    onDisconnection(socket, io)
    {
        socket.on('disconnect', function () => {

            ServerUtilies.info(io, " User exit ");

            this.userCount--;
            io.sockets.emit(Events.lobby.UPDATE_USER_COUNT, this.userCount);


            this.server_removePlayerFormCurrentLobby(socket);

        });
    }

    server_removePlayerFormCurrentLobby(socket)
    {
        socket.get('userId', function (err, userId) =>
        {
            socket.get('gameLobbyId', function (err, gameLobbyId) =>
            {
                if (gameLobbyId)
                {
                    socket.broadcast.to(gameLobbyId).emit(Events.gameLobby.PLAYER_DISCONNECTED, userId);
                    socket.leave(gameLobbyId);

                    if (this.gameLobbies[gameLobbyId])
                    {
                        this.gameLobbies[gameLobbyId].remove(userId)
                       
                        //Checks if there is anyone left in the room
                        if (this.gameLobbies[gameLobbyId].isLobbyEmpty())
                        {
                            //Delete gameb lobby
                            delete this.gameLobbies[gameLobbyId];

                            //Update all clients that this lobby is now closed.
                            io.sockets.emit(Events.client.UPDATE_ALL_GAME_LOBBIES, JSON.stringify(this.getGameLobbies()));
                        }
                    }
                }
            });
        });

    }


    server_init(socket, io)
    {

        // Create lobby
        socket.on(Events.lobby.CREATE_GAME_LOBBY, function (data) =>
        {

            //If the user was connected to another room disconnect them
            this.server_removePlayerFormCurrentLobby(socket);

            data.nPlayers = sanitize(data.nPlayers).xss();
            data.name = sanitize(data.name).xss();
            data.name = data.name.substring(0, 20);
            data.mapName = sanitize(data.mapName).xss();

            // Check the user input
            if (data.nPlayers > ServerSettings.MAX_PLAYERS_PER_LOBBY || data.nPlayers < 2)
            {
                data.nPlayers = 4;
            }

            //Once a new game lobby has been created, add the user who created it.

            socket.get('userId', function (err, userId) =>
            {
                socket.get('googleUserId', function (err, googleUserId) =>
                {

                    io.log.info(Util.format("@ Create lobby by user with ID [%s] with name  [%s] using map ", data.name, googleUserId, data.mapName));
                    var newGameLobby = this.server_createGameLobby(data.name, parseInt(data.nPlayers), data.mapName);
                    newGameLobby.join(userId, googleUserId, socket);


                    console.log(" Lobby list " + this.gameLobbies);
                    io.sockets.emit(Events.client.UPDATE_ALL_GAME_LOBBIES, JSON.stringify(this.getGameLobbies()));
                });

            });
        });

        // Google plus login
        socket.on(Events.lobby.GOOGLE_PLUS_LOGIN, function (googleAuthToken) => {

            // TODO use this inside of cURL
            //request({
            //    uri: "localhost:12060/repository/schema/fieldType",
            //    method: "POST",
            //    json: {
            //        action: "create",
            //        fieldType: {
            //            name: "n$name",
            //            valueType: { primitive: "STRING" },
            //            scope: "versioned",
            //            namespaces: { "my.demo": "n" }
            //        }
            //    }
            //});

            //io.log.info(Util.format("@ Events.lobby.GOOGLE_PLUS_LOGIN " + googleAuthToken));

            ////Call the RESTful api to find how the userId of the auth user from the token
            //curl(ServerSettings.LEADERBOARDS_API + "findUserIdByToken/" + googleAuthToken, function (err)
            //{
            //    var googleUserId = JSON.parse(this.body);

            //    //Assiocate this socket with the G+ userId
            //    socket.set('googleUserId', googleUserId);

            //});

        });

        // PLAYER_JOIN Game lobby
        socket.on(Events.gameLobby.PLAYER_JOIN, function (gamelobbyId) => {

            //If the user was connected to another room disconnect them
            this.server_removePlayerFormCurrentLobby(socket);

            io.log.info(Util.format("@ Events.client.JOIN_GAME_LOBBY " + gamelobbyId));

            // Get the usersId
            socket.get('userId', function (err, userId) =>
            {
                socket.get('googleUserId', function (err, googleUserId) =>
                {
                    var gamelobby: GameLobby = this.gameLobbies[gamelobbyId];
                    gamelobby.join(userId, googleUserId, socket);

                    io.sockets.emit(Events.client.UPDATE_ALL_GAME_LOBBIES, JSON.stringify(this.getGameLobbies()));
                });
            });

        });

        socket.on(Events.gameLobby.START_GAME_FOR_OTHER_CLIENTS, function (data)
        {

            socket.get('userId', function (err, userId) =>
            {

                socket.get('gameLobbyId', function (err, gameLobbyId) =>
                {

                    //this.gameLobbies[gameLobbyId].currentPlayerId = userId;
                    io.log.info(Util.format("@ Events.gameLobby.START_GAME_FOR_OTHER_CLIENTS " + userId + " for lobby " + gameLobbyId + "   " + data));
                    socket.broadcast.to(gameLobbyId).emit(Events.gameLobby.START_GAME_FOR_OTHER_CLIENTS, data);
                });
            });

        });

        /************************************************************
        *   Game sync event bindings  
        ************************************************************/

        socket.on(Events.client.UPDATE, function (data)
        {

            socket.get('userId', function (err, userId) =>
            {
                socket.get('gameLobbyId', function (err, gameLobbyId) =>
                {
                    io.log.info(Util.format("@ UPDATE   " + data));
                    socket.broadcast.to(gameLobbyId).emit(Events.client.UPDATE, data);
                });
            });

        });


        socket.on(Events.client.ACTION, function (data) => {

            socket.get('userId', function (err, userId) =>
            {

                socket.get('gameLobbyId', function (err, gameLobbyId) =>
                {
                    io.log.info(Util.format("@ Events.gameLobby.UPDATE from userId " + userId + " for lobby " + gameLobbyId + "   " + data));
                    socket.broadcast.to(gameLobbyId).emit(Events.client.ACTION, data);
                });
            });
        });

        // This is done to make the action packets smaller
        socket.on(Events.client.CURRENT_WORM_ACTION, function (data) => {

            socket.get('userId', function (err, userId) =>
            {

                socket.get('gameLobbyId', function (err, gameLobbyId) =>
                {
                    io.log.info(Util.format("@ Events.client.CURRENT_WORM_ACTION" + userId + " for lobby " + gameLobbyId + "   " + data));
                    socket.broadcast.to(gameLobbyId).emit(Events.client.CURRENT_WORM_ACTION, data);
                });
            });

        });


    }


    client_init()
    {
        this.menu = new LobbyMenu(this)

        // Somthing didnt go right with connnecting to the server so exit
        if (!Client.connectionToServer(Settings.NODE_SERVER_IP, Settings.NODE_SERVER_PORT))
        {
            return false;
        }

        GameInstance.gameType = Game.types.ONLINE_GAME;

        // Create lobby
        Client.socket.on(Events.lobby.UPDATE_USER_COUNT, function (userCount) =>
        {
            Logger.log("Events.lobby.NEW_USER_CONNECTED " + userCount);
            this.userCount = userCount;
            this.menu.updateUserCountUI(this.userCount);
        });

        //Bind events
        Client.socket.on(Events.client.UPDATE_ALL_GAME_LOBBIES, function (data) =>
        {
            Logger.debug(" Events.client.UPDATE_ALL_GAME_LOBBIES " + data);
            var gameLobbyList = JSON.parse(data);
            var updatedGameLobbies = {};
            for (var gameLobby in gameLobbyList)
            {
                updatedGameLobbies[gameLobby] = (Utilies.copy(new GameLobby(null, null), gameLobbyList[gameLobby]));
            }

            this.gameLobbies = updatedGameLobbies;
            this.menu.updateLobbyListUI(this);

        });

        this.client_GameLobby.client_init();

    }

    getGameLobbies()
    {
        return this.gameLobbies;
    }


    client_createGameLobby(name, numberOfPlayers, mapName)
    {
        this.menu.displayMessage(" Waiing on more players.... ");
        Client.socket.emit(Events.lobby.CREATE_GAME_LOBBY, { "name": name, "nPlayers": numberOfPlayers, "mapName": mapName });
    }

    // Creates the gamelobby object on the server
    server_createGameLobby(name, numberOfPlayers, mapName)
    {
        var newGameLobby = new GameLobby(name, numberOfPlayers, mapName);
        newGameLobby.server_init();

        // lobbies are indexed by their unqine token
        this.gameLobbies[newGameLobby.id] = newGameLobby;

        return this.gameLobbies[newGameLobby.id];
    }

    client_joinGameLobby(lobbyId)
    {
        this.menu.displayMessage(" Waiting on more players.... ");
        Client.socket.emit(Events.gameLobby.PLAYER_JOIN, lobbyId);
    }


    client_joinQuickGame()
    {

        for (var i in this.gameLobbies)
        {
            var lob: GameLobby = this.gameLobbies[i];

            if (lob.isFull() == false)
            {
                if (lob.contains(Client.id))
                {
                    Notify.display("Your already join the lobby", "Still waiting for players");
                }
                else
                {
                    this.menu.displayMessage(" Waiting on more players.... ");
                    Client.socket.emit(Events.gameLobby.PLAYER_JOIN, lob.id);
                    return true;
                }
            }
        }

        //If it doesn't find any empty lobby for the user it creates one.
        this.client_createGameLobby("Default QuickGame", 2, Maps.smallCastle.name);
    }


}

// Removes the need to have to do the follow
// var Lobby = require('./Lobby');
// new Lobby.Lobby();
declare var exports: any;
if (typeof exports != 'undefined')
{
    (module ).exports = Lobby;
}