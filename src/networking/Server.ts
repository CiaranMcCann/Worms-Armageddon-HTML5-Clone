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
declare var Util;


//var io;

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

    constructor (port)
    {   
        io = require('socket.io').listen(port);
        this.lobby = new Lobby();

        io.sockets.on('connection', function (socket) =>
        {
            this.lobby.server_createGameLobby("Default", 2);

            this.lobby.onConnection(socket,io);
            this.lobby.server_init(socket,io);
            this.lobby.onDisconnection(socket,io);
        });
    }

}

var serverInstance = new GameServer(8080);

