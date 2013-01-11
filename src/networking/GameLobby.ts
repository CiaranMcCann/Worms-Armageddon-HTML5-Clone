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

        //socket.emit('createdNewPlayerId', playerCount);
        //console.log(" New player has connected and has been assgined ID " + playerCount);

        //socket.on('addNewPlayerToGame', function (player)
        //{
        //    console.log(player);
        //});
    }

    client_init()
    {
        Client.socket.on(Events.client.START_GAME, function (players)
        {
            Logger.debug("Events.client.START_GAME " + players);
            var playerIds = JSON.parse(players);
            GameInstance.start(playerIds);
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
            io.sockets.in(this.id).emit(Events.client.START_GAME, JSON.stringify(this.players));
        }
    }

}


declare var exports: any;
if (typeof exports != 'undefined') {
  (module).exports = GameLobby;
}
