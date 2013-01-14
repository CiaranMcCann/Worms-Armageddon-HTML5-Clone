/**
 *  
 * GameLobby.js
 *
 *  License: Apache 2.0
 *  author:  Ciarán McCann
 *  url: http://www.ciaranmccann.me/
 */

///<reference path="../Game.ts"/>
///<reference path="ServerUtilies.ts"/>

// Had to give up the benfits of types in this instance, as a problem with the way ES6 proposal module system
// works with Node.js modules. http://stackoverflow.com/questions/13444064/typescript-conditional-module-import-export
//declare function require(s);
try
{
//This is some mega hacky stuff, but its the only way I can get around a very strange typescript static anaylse error which
// prevents the project from compling.
    eval(" var Events = require('./Events');var ServerUtilies = require('./ServerUtilies');var Util = require('util');var ServerSettings = require('./ServerSettings');");

} catch (error) { }

var SOCKET_STORAGE_GAMELOBBY_ID = 'gameLobbyId';

class GameLobby
{
    private playerIds: number[];
    name: string;
    id: string;
    private numberOfPlayers: number;
    isPrivate: bool;
    currentPlayerId: string;
    hostId: string;

    static gameLobbiesCounter = 0;

    constructor(name: string, numberOfPlayers: number, userId : string)
    {
        this.name = name;
        this.isPrivate = false;
        this.playerIds = [];
        this.numberOfPlayers = numberOfPlayers;
        this.hostId = userId;

    }

    getNumberOfPlayers()
    {
        return this.numberOfPlayers;
    }

    getPlayerSlots(){
        return this.playerIds.length;
    }

    server_init()
    {
        this.id = ServerUtilies.createToken() + GameLobby.gameLobbiesCounter;
        GameLobby.gameLobbiesCounter++;
    }

    client_init()
    {
        //Have the host client setup all the player objects with all the other clients ids
        Client.socket.on(Events.gameLobby.START_GAME_HOST, function (data) =>
        {
            var gameLobby = (Utilies.copy(new GameLobby(null, null,null), data));
            
            //Update local copy of the lobby
            GameInstance.lobby.client_GameLobby = gameLobby;

            //Pass player ids to init the game
            GameInstance.start(gameLobby.playerIds);

            //Once we have init the game, we most send all the game info to the other players
            Client.socket.emit(Events.gameLobby.START_GAME_FOR_OTHER_CLIENTS, { "lobby": gameLobby, "gameData": GameInstance.getGameNetData() });

        });

        // Start the game for all other playrs by passing the player information create
        // by the host client to them.
        Client.socket.on(Events.gameLobby.START_GAME_FOR_OTHER_CLIENTS, function (data) =>
        {
             var gameLobby = (Utilies.copy(new GameLobby(null, null,null), data.lobby));
             
             //Update local copy of the lobby
            GameInstance.lobby.client_GameLobby = gameLobby;

            //Just popluate the array with some players, we will override them with proper data now
            for (var i = 0; i <  gameLobby.playerIds.length ; i++)
            {
                GameInstance.players.push(new Player());
            }

            GameInstance.setGameNetData(data.gameData);
            GameInstance.start();
        });



    }

    contains(playerId: string)
    {
        for (var i in this.playerIds)
        {
            return this.playerIds[i] == playerId;
        }

        return false;
    }

    join(userId, socket)
    {
        console.log("Player " + userId + " added to gamelobby " + this.id + " and name " + this.name);

        // Add the player to the gameLobby socket.io room
        socket.join(this.id);

        // Write the gameLobbyId to the users socket
        socket.set(SOCKET_STORAGE_GAMELOBBY_ID, this.id);

        this.playerIds.push(userId);

        this.server_startGame(socket,userId)
    }

    isFull()
    {
        return this.numberOfPlayers == this.playerIds.length;
    }

    server_startGame(socket,userId)
    {

        if (this.isFull())
        {
            socket.emit(Events.gameLobby.START_GAME_HOST, this);
        }
    }

}


declare var exports: any;
if (typeof exports != 'undefined')
{
    (module ).exports = GameLobby;
}
