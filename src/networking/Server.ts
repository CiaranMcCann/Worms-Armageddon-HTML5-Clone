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
    var Util = require('util');
   

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
                io.log.info(Util.format(" User connected and assigned ID [%s]", token));
               
            });
            socket.emit(Events.client.ASSIGN_USER_ID, token);
            this.userCount++;

            // When someone makes a connection send them the lobbies
            socket.emit(Events.client.UPDATE_ALL_GAME_LOBBIES, JSON.stringify(this.lobby.getGameLobbies()));

            this.lobby.server_init(socket,io);
        });
    }

}


var serverInstance = new GameServer(8080);
serverInstance.init();
