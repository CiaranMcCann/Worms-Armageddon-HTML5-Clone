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

// Had to give up the benfits of types in this instance, as a problem with the way ES6 proposal module system
// works with Node.js modules. http://stackoverflow.com/questions/13444064/typescript-conditional-module-import-export
declare var Util;
try
{
    //This is some mega hacky stuff, but its the only way I can get around a very strange typescript static anaylse error which
    // prevents the project from compling.
    eval("var GameLobby = require('./GameLobby');var Events = require('./Events');  var ServerSettings = require('./ServerSettings'); var ServerUtilies = require('./ServerUtilies'); var Util = require('util');")
} catch (error){}



class Lobby
{
    private gameLobbies: GameLobby[];
    private client_GameLobby: GameLobby;
    menu: LobbyMenu;

    constructor ()
    {
        
        this.gameLobbies = [];
        this.client_GameLobby = new GameLobby(null, null);
        

        //If on server the view won't be availaible
        try
        {
            this.menu = new LobbyMenu(this);
        } catch (e) { }
    }

    server_init(socket,io)
    {       
        // Create lobby
            socket.on(Events.lobby.CREATE_GAME_LOBBY, function (data) =>
            {

                // Check the user input
                if (data.nPlayers > ServerSettings.MAX_PLAYERS_PER_LOBBY || data.nPlayers < 2)
                {
                    data.nPlayers = 4;
                }

                io.log.info(Util.format(" Create lobby with name  [%s]",data.name));
                var newGameLobby = this.server_createGameLobby(data.name, parseInt(data.nPlayers));

                //Once a new game lobby has been created, add the user who created it.
                socket.get(GameServer.SOCKET_USERID, function (err, userId) =>
                {
                    socket.join(newGameLobby.id);
                    newGameLobby.addPlayer(userId);
                    
                });

                io.sockets.emit(Events.client.UPDATE_ALL_GAME_LOBBIES, JSON.stringify(this.getGameLobbies()));
            });



            // PLAYER_JOIN Game lobby
            socket.on(Events.client.JOIN_GAME_LOBBY, function (gamelobbyId) =>{

                console.log("Events.client.JOIN_GAME_LOBBY " + gamelobbyId);
                // Get the usersId
                socket.get(GameServer.SOCKET_USERID,  function (err, userId) =>
                {
                    var gamelobby: GameLobby = this.findGameLobby(gamelobbyId);

                    socket.join(gamelobby.id);

                    gamelobby.addPlayer(userId);
                    gamelobby.startGame(io);

                    io.sockets.emit(Events.client.UPDATE_ALL_GAME_LOBBIES, JSON.stringify(this.getGameLobbies()));
                });

            });

    }

    //Setup the lobby, and connections to the Node server. 
    client_init()
    {
        var result = Client.connectionToServer(Settings.NODE_SERVER_IP, Settings.NODE_SERVER_PORT);

        // Somthing didnt go right with connnecting to the server so exit
        if (result == false)
        {
            return result;
        }
        GameInstance.gameType = Game.types.ONLINE_GAME;


        //Bind events
        Client.socket.on(Events.client.UPDATE_ALL_GAME_LOBBIES, function (data) =>
        {
            Logger.debug(" Events.client.UPDATE_ALL_GAME_LOBBIES ");
            var gameLobbies = JSON.parse(data);
            var updatedGameLobbies = []; 
            for (var i = 0; i < gameLobbies.length; i++)
            {
                updatedGameLobbies.push(Utilies.copy(new GameLobby(null, null), gameLobbies[i]));
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

    findGameLobby(gameLobbyId)
    {
         return ServerUtilies.findByValue(gameLobbyId, this.gameLobbies, "id");
    }

    client_createGameLobby(name, numberOfPlayers)
    {
        Client.socket.emit(Events.lobby.CREATE_GAME_LOBBY, { "name": name, "nPlayers": numberOfPlayers });
    }

    // Creates the gamelobby object on the server
    server_createGameLobby(name, numberOfPlayers)
    {
        var gameLobby = new GameLobby(name, numberOfPlayers);
        this.gameLobbies.push(gameLobby); 
        return gameLobby;
    }

    client_joinGameLobby(lobbyId)
    {
        // displayMessage saying waiting on x players

        this.menu.displayMessage(" Waitting on 2 more players.... ");
        Client.socket.emit(Events.client.JOIN_GAME_LOBBY, lobbyId);
    }

    joinQuickGame(lobbyName: string)
    {
        // FIND a game quick that is waitting on a player
        Client.socket.emit(Events.client.JOIN_GAME_LOBBY, lobbyName);
    }


}

declare var exports: any;
if (typeof exports != 'undefined') {
  (module).exports = Lobby;
}