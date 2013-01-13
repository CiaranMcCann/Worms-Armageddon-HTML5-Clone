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
declare function require(s);
try
{   
    var Events = require('./Events');
    var ServerUtilies = require('./ServerUtilies');
    var Util = require('util');
    var ServerSettings = require('./ServerSettings');

} catch (error){}

var SOCKET_STORAGE_GAMELOBBY_ID = 'gameLobbyId';

class GameLobby
{
    players: number[];
    name: string;
    id: string;
    numberOfPlayers: number;
    isPrivate: bool;

    static gameLobbiesCounter = 0;

    constructor (name :string, numberOfPlayers : number)
    {
        this.name = name;   
        this.isPrivate = false;
        this.players = [];      
        this.numberOfPlayers = numberOfPlayers;

    }

    server_init()
    {
       this.id = ServerUtilies.createToken() + GameLobby.gameLobbiesCounter;
       GameLobby.gameLobbiesCounter++;
    }

    client_init()
    {
        //Have the host client setup all the player objects with all the other clients ids
        Client.socket.on(Events.gameLobby.START_GAME_HOST, function ( playerIds : number[])
        {
            Logger.debug("Events.client.START_GAME_HOST " +  playerIds);
            GameInstance.start(playerIds);

            //Once we have init the game, we most send all the game info to the other players
            Client.socket.emit(Events.gameLobby.START_GAME_FOR_OTHER_CLIENTS, { "nPlayers": playerIds.length, "gameData": GameInstance.getGameNetData() } );
            
        });

        Client.socket.on(Events.gameLobby.UPDATE, function ( data )
        {
            Logger.debug(" Events.gameLobby.UPDATE " +  data );   
            GameInstance.state.getCurrentPlayerObject().getTeam().getCurrentWorm().fire();
        });

        // Start the game for all other playrs by passing the player information create
        // by the host client to them.
        Client.socket.on(Events.gameLobby.START_GAME_FOR_OTHER_CLIENTS, function (data)
        {
            Logger.debug("Events.client.START_GAME_FOR_OTHER_CLIENTS " + data);

            //Just popluate the array with some players, we will override them with proper data now
            for (var i = 0; i < data.nPlayers; i++)
            {
                  GameInstance.players.push(new Player());
            }

            GameInstance.setGameNetData(data.gameData);
            GameInstance.start();
        });



    }

    contains(playerId: string)
    {
        for (var i in this.players)
        {
            return this.players[i] == playerId;
        }

        return false;
    }

    join(userId,socket)
    {
        console.log("Player " + userId + " added to gamelobby " + this.id + " and name " + this.name );
        
        // Add the player to the gameLobby socket.io room
        socket.join(this.id);

        // Write the gameLobbyId to the users socket
        socket.set(SOCKET_STORAGE_GAMELOBBY_ID, this.id);

        this.players.push(userId);
    }
    
    isFull()
    {
        return this.numberOfPlayers == this.players.length;
    }

    startGame(socket)
    {
       
        if (this.isFull())
        {         
            socket.emit(Events.gameLobby.START_GAME_HOST, this.players);
        }
    }

}


declare var exports: any;
if (typeof exports != 'undefined') {
  (module).exports = GameLobby;
}
