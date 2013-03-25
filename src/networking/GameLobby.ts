/// <reference path="../WormAnimationManger.ts" />
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

// Had to give up the benfits of types in this instance, as a problem with the way ES6/Typescript module system
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
    static LOBBY_STATS = {
        WATTING_FOR_PLAYERS: 0,
        GAME_IN_PLAY: 1
    }

    private playerIds: string[];
    name: string;
    id: string;
    gameLobbyCapacity: number;

    status: number;

    mapName;
    currentPlayerId: string;

    static gameLobbiesCounter = 0;

    constructor(name: string, numberOfPlayers: number, mapName : string  = "priates" )
    {
        this.name = name;
        this.mapName = mapName;
        this.playerIds = [];
        this.gameLobbyCapacity = numberOfPlayers;
        this.currentPlayerId = "";
    }

    getNumberOfPlayers()
    {
        return this.gameLobbyCapacity;
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
            var gameLobby = (Utilies.copy(new GameLobby(null, null), data));
            Game.map = new Map(Maps[gameLobby.mapName]);
            
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
             var gameLobby = (Utilies.copy(new GameLobby(null, null), data.lobby));          
             Game.map = new Map(Maps[gameLobby.mapName]);

             //Update local copy of the lobby
            GameInstance.lobby.client_GameLobby = gameLobby;

            //Just popluate the array with some players, we will override them with proper data now
            for (var i = 0; i <  gameLobby.playerIds.length ; i++)
            {
                GameInstance.players.push(new Player(gameLobby.playerIds[i]));
            }

            GameInstance.setGameNetData(data.gameData);
            GameInstance.start();
        });

        Client.socket.on(Events.gameLobby.PLAYER_DISCONNECTED, function (playerId)
        {
            Logger.log("Events.gameLobby.PLAYER_DISCONNECTED " + playerId);


            for (var j = GameInstance.players.length - 1; j >= 0; j--)
            {
                if (GameInstance.players[j].id == playerId)
                {
                    Notify.display(
                        GameInstance.players[j].getTeam().name + " has disconnected ",
                        "Looks like you were too much competition for them. They just gave up, well done!! Although they might have just lost connection... though we will say you won =)",
                    13000)

                    var worms = GameInstance.players[j].getTeam().getWorms();
                    //Kill all the players worms.
                    for (var i = 0; i < worms.length; i++)
                    {
                        worms[i].hit(999,null,true);
                    }

                    //If the user who disconnected is the current one signal next turn
                    if (GameInstance.players[j].id == GameInstance.state.getCurrentPlayer().id)
                    {
                        GameInstance.state.tiggerNextTurn();
                    }
                    return;
                }
            }
        });



    }

    contains(playerId: string) : bool
    {
        for (var i in this.playerIds)
        {          
            if (this.playerIds[i] == playerId)
            {
                return true;
            }
        }

        return false;
    }

    isLobbyEmpty()
    {
        return (this.playerIds.length == 0);
    }

    join(userId, googleUserId, socket)
    {
        //Stops a user from joing a room twice
        if (this.contains(userId) == false && this.status == GameLobby.LOBBY_STATS.WATTING_FOR_PLAYERS)
        {
            console.log("Player " + googleUserId + " added to gamelobby " + this.id + " and name " + this.name);

            // Add the player to the gameLobby socket.io room
            socket.join(this.id);

            //if (this.currentPlayerId == null)
            {
                this.currentPlayerId = userId;
            }

            // Write the gameLobbyId to the users socket
            socket.set(SOCKET_STORAGE_GAMELOBBY_ID, this.id);

            this.playerIds.push(userId);

            //if the room is full start game
            if (this.isFull())
            {
                socket.emit(Events.gameLobby.START_GAME_HOST, this);
                this.status = GameLobby.LOBBY_STATS.GAME_IN_PLAY;

            } else
            {
                this.status = GameLobby.LOBBY_STATS.WATTING_FOR_PLAYERS;
            }
        }
    }

    remove(userId)
    {
       var index = this.playerIds.indexOf(userId);

       if (index >= 0)
       {
           ServerUtilies.deleteFromCollection(this.playerIds, index);
       }
    }

    isFull()
    {
        return this.gameLobbyCapacity == this.playerIds.length;
    }

}


declare var exports: any;
if (typeof exports != 'undefined')
{
    (module ).exports = GameLobby;
}
