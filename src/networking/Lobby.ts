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

// Had to give up the benfits of types in this instance, as a problem with the way ES6 proposal module system
// works with Node.js modules. http://stackoverflow.com/questions/13444064/typescript-conditional-module-import-export
var GameLobby = require('./GameLobby');
var Events = require('./Events');

class Lobby
{
    gameLobbies;
    menu: LobbyMenu;

    constructor ()
    {
        this.gameLobbies = [];     
    }

    //Setup the lobby, and connections to the Node server. 
    init()
    {
         Client.connectionToServer(Settings.NODE_SERVER_IP, Settings.NODE_SERVER_PORT);
         GameInstance.gameType = Game.types.ONLINE_GAME;
    }

    createGameLobby(name,numberOfPlayers)
    {       
        this.gameLobbies.push( new GameLobby( " random " ) );
    }

    joinGameLobby(lobbyName: string)
    {
        // displayMessage saying waiting on x players
        this.menu.displayMessage(" Waitting on 2 more players.... ");
        Client.socket.emit(Events.client.JOIN_GAME_LOBBY, lobbyName);
    }

    joinQuickGame(lobbyName: string)
    {
        // FIND a game quick that is waitting on a player

        Client.socket.emit(Events.client.JOIN_GAME_LOBBY, lobbyName);
    }

    client_updateAllLobbies(lobbies)
    {
        this.menu.updatelobbies(lobbies);
    }

}