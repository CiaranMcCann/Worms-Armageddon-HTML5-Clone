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

// Had to give up the benfits of types in this instance, as a problem with the way ES6 proposal module system
// works with Node.js modules. http://stackoverflow.com/questions/13444064/typescript-conditional-module-import-export

try
{
    //This is some mega hacky stuff, but its the only way I can get around a very strange typescript static anaylse error which
    // prevents the project from compling.
    eval("var GameLobby = require('./GameLobby');var Events = require('./Events'); " +
        " var ServerSettings = require('./ServerSettings'); var ServerUtilies = require('./ServerUtilies'); "+
        "var Util = require('util');")
} catch (error) { }



class Lobby
{
    private gameLobbies;
    private client_GameLobby: GameLobby;
    menu: LobbyMenu;

    constructor()
    {

        this.gameLobbies = {};
        this.client_GameLobby = new GameLobby(null, null);
    }

    server_init(socket, io)
    {
        // Create lobby
        socket.on(Events.lobby.CREATE_GAME_LOBBY, function (data) =>
        {

            // Check the user input
            if (data.nPlayers > ServerSettings.MAX_PLAYERS_PER_LOBBY || data.nPlayers < 2)
            {
                data.nPlayers = 4;
            }

            io.log.info(Util.format("@ Create lobby with name  [%s]", data.name));
            var newGameLobby = this.server_createGameLobby(data.name, parseInt(data.nPlayers));

            // lobbies are indexed by their unqine token
            this.gameLobbies[newGameLobby.id] = newGameLobby;

            //Once a new game lobby has been created, add the user who created it.
            socket.get('userId', function (err, userId) =>
            {
                newGameLobby.join(userId, socket);
            });

            console.log(" Lobby list " + this.gameLobbies);
            io.sockets.emit(Events.client.UPDATE_ALL_GAME_LOBBIES, JSON.stringify(this.getGameLobbies()));
        });



        // PLAYER_JOIN Game lobby
        socket.on(Events.gameLobby.PLAYER_JOIN, function (gamelobbyId) => {

            io.log.info(Util.format("@ Events.client.JOIN_GAME_LOBBY " + gamelobbyId));

            // Get the usersId
            socket.get('userId', function (err, userId) =>
            {
                var gamelobby: GameLobby = this.gameLobbies[gamelobbyId];
                gamelobby.join(userId, socket);
                gamelobby.startGame(io);


                io.sockets.emit(Events.client.UPDATE_ALL_GAME_LOBBIES, JSON.stringify(this.getGameLobbies()));
            });

        });


        /************************************************************
        *   Game sync event bindings  
        ************************************************************/


        socket.on(Events.gameLobby.UPDATE, function (data) => {

             io.log.info(Util.format("@ Events.gameLobby.UPDATE" + data));
            
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


    client_createGameLobby(name, numberOfPlayers)
    {
        Client.socket.emit(Events.lobby.CREATE_GAME_LOBBY, { "name": name, "nPlayers": numberOfPlayers });
    }

    // Creates the gamelobby object on the server
    server_createGameLobby(name, numberOfPlayers)
    {
        var gameLobby = new GameLobby(name, numberOfPlayers);
        gameLobby.server_init();


        return gameLobby;
    }

    client_joinGameLobby(lobbyId)
    {
        this.menu.displayMessage(" Waitting on more players.... ");
        Client.socket.emit(Events.gameLobby.PLAYER_JOIN, lobbyId);
    }

    joinQuickGame(lobbyName: string)
    {
        // FIND a game quick that is waitting on a player
        Client.socket.emit(Events.gameLobby.PLAYER_JOIN, lobbyName);
    }


}

declare var exports: any;
if (typeof exports != 'undefined')
{
    (module ).exports = Lobby;
}