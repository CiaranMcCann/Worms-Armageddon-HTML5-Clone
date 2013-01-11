/**
 *  
 * Server.js
 *
 *  License: Apache 2.0
 *  author:  Ciarán McCann
 *  url: http://www.ciaranmccann.me/
 */
//<reference path="../../external/socket.io-0.9.d.ts"/>
///<reference path="ServerUtilies.ts"/>
///<reference path="GameLobby.ts"/>
///<reference path="Events.ts"/>
///<reference path="Lobby.ts"/>
declare function require(s);

var io;

// HACK
// Had to give up the benfits of types in this instance, as a problem with the way ES6 proposal module system
// works with Node.js modules. http://stackoverflow.com/questions/13444064/typescript-conditional-module-import-export
try
{
    var Events = require('./Events');
    var ServerUtilies = require('./ServerUtilies');
    var GameLobby = require('./GameLobby');
    var ServerSettings = require('./ServerSettings');
    var Lobby = require('./Lobby');

} catch (error) { }

class GameServer
{

    lobby: Lobby;
    userCount: number;
    static SOCKET_USERID = 'userId';

    constructor (port)
    {
        io = require('socket.io').listen(port);
        this.lobby = new Lobby();
        this.userCount = 0;       
    }

    init()
    {
        io.sockets.on('connection', function (socket) =>
        {

            //When any user connects to the node server we set their socket an ID
            //so we can idefnitny them unqine in their dealings with the server
            var token = ServerUtilies.createToken() + this.userCount;
            socket.set(GameServer.SOCKET_USERID, token, function () =>
            {
                ServerUtilies.log(" User connected and assigned ID [" + token + "]");
                              
            });
            this.userCount++;

            // When someone makes a connection send them the lobbies
            socket.emit(Events.client.UPDATE_ALL_GAME_LOBBIES, JSON.stringify(this.lobby.getGameLobbies()));


            // Create lobby
            socket.on(Events.lobby.CREATE_GAME_LOBBY, function (data) =>
            {
                // Check the user input
                if (data.nPlayers > ServerSettings.MAX_PLAYERS_PER_LOBBY || data.nPlayers < 2)
                {
                    data.nPlayers = 4;
                }

                ServerUtilies.log(" Create lobby with name [" + data.name + "]");
                var newGameLobby = this.lobby.server_createGameLobby(data.name, data.nPlayers);

                //Once a new game lobby has been created, add the user who created it.
                socket.get(GameServer.SOCKET_USERID, function (err, userId) =>
                {
                    socket.join(newGameLobby.id);
                    newGameLobby.addPlayer(io, userId);
                    
                });

                io.sockets.emit(Events.client.UPDATE_ALL_GAME_LOBBIES, JSON.stringify(this.lobby.getGameLobbies()));
            });


            // PLAYER_JOIN Game lobby
            socket.on(Events.client.JOIN_GAME_LOBBY, function (gamelobbyId) =>{
              

                // Get the usersId
                socket.get(GameServer.SOCKET_USERID,  function (err, userId) =>
                {
                    var gamelobby: GameLobby = this.lobby.findGameLobby(gamelobbyId);
                    socket.join(gamelobby.id);
                    gamelobby.addPlayer(io,userId);
                    console.log(userId);
                    io.sockets.emit(Events.client.UPDATE_ALL_GAME_LOBBIES, JSON.stringify(this.lobby.getGameLobbies()));
                });

            });


        });
    }

}

var serverInstance = new GameServer(8080);
serverInstance.init();
