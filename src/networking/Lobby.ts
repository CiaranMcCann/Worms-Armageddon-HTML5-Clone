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
try
{
    var GameLobby = require('./GameLobby');
    var Events = require('./Events');
    var ServerUtilies = require('./ServerUtilies');
} catch (error){}



class Lobby
{
    private gameLobbies: GameLobby[];
    private client_GameLobby: GameLobby;
    menu: LobbyMenu;

    constructor ()
    {
        this.gameLobbies = [];

        //If on server the view won't be availaible
        try
        {
            this.menu = new LobbyMenu(this);
        } catch (e) { }
    }

    //Setup the lobby, and connections to the Node server. 
    client_init()
    {
        Client.connectionToServer(Settings.NODE_SERVER_IP, Settings.NODE_SERVER_PORT);
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

        // Messaged recived back to confirm player has joined the lobby 
        // and to give the player a copy of the GameLobby object
        Client.socket.on(Events.client.JOIN_GAME_LOBBY, function (data) =>
        {
            this.client_GameLobby = Utilies.copy(new GameLobby(null, null), JSON.parse(data));
            this.client_GameLobby.client_init();
        })

               

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