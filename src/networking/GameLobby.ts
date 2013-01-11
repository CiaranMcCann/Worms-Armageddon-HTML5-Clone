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
try
{   
    var Events = require('./Events');
    var ServerUtilies = require('./ServerUtilies');
    var Util = require('util');
    var ServerSettings = require('./ServerSettings');

} catch (error){}


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

        if (ServerUtilies)
        {
            this.id = ServerUtilies.createToken() + GameLobby.gameLobbiesCounter;
        }
        GameLobby.gameLobbiesCounter++;

        this.isPrivate = false;
        this.players = [];
        
        this.numberOfPlayers = numberOfPlayers;

    }

    server_init(socket,io)
    {

    }

    client_init()
    {
        //Have the host client setup all the player objects with all the other clients ids
        Client.socket.on(Events.client.START_GAME_HOST, function (players)
        {
            Logger.debug("Events.client.START_GAME " + players);
            var playerIds = JSON.parse(players);
            GameInstance.start(playerIds);

            //Once we have init the game, we most send all the game info to the other players
            Client.socket.emit(Events.client.game.UPDATE, GameInstance.players);
        });

        // Start the game for all other playrs by passing the player information create
        // by the host client to them.
        Client.socket.on(Events.client.START_GAME_FOR_OTHER_CLIENTS, function (players)
        {
            Logger.debug("Events.client.START_GAME_FOR_OTHER_CLIENTS" + players);
            GameInstance.players = JSON.parse(players);
            GameInstance.start();
        });

    }

    addPlayer(userId)
    {
        console.log("Player " + userId + " added to gamelobby " + this.id + " and name " + this.name);
        this.players.push(userId);
    }

    startGame(io)
    {
       
        if (this.players.length == this.numberOfPlayers)
        {         
            io.sockets.in(this.id).emit(Events.client.START_GAME_HOST, JSON.stringify(this.players));
        }
    }

}


declare var exports: any;
if (typeof exports != 'undefined') {
  (module).exports = GameLobby;
}
