/**
 *  
 * Server.js
 *
 *  License: Apache 2.0
 *  author:  Ciarán McCann
 *  url: http://www.ciaranmccann.me/
 */
///<reference path="../../external/socket.io-0.9.d.ts"/>
///<reference path="ServerUtilies.ts"/>
///<reference path="GameLobby.ts"/>
///<reference path="Events.ts"/>
///<reference path="Lobby.ts"/>


// HACK
// Had to give up the benfits of types in this instance, as a problem with the way ES6 proposal module system
// works with Node.js modules. http://stackoverflow.com/questions/13444064/typescript-conditional-module-import-export
try
{
    var Events = require("./Events");
    //console.log(Events);
    var ServerUtilies = require("./ServerUtilies");
    //console.log(ServerUtilies);
    var GameLobby = require('./GameLobby');
    //console.log(GameLobby);
    var Lobby = require('./Lobby');

} catch (e) { }

class GameServer
{

    io;
    lobby: Lobby;
    userCount: number;
    static SOCKET_USERID = 'userId';


    constructor (port)
    {
        this.io = require('socket.io').listen(port);
        this.lobby = new Lobby();
        this.userCount = 0;
    }

    init()
    {
        this.io.sockets.on('connection', function (socket: Socket) =>
        {

            //When any user connects to the node server we set their socket an ID
            //so we can idefnitny them unqine in their dealings with the server
            socket.set(GameServer.SOCKET_USERID, this.userCount, function () =>
            {
                ServerUtilies.log(" User connected and assigned ID [" + this.userCount + "]");              
            });
            this.userCount++;

            socket.emit(Events.client.UPDATE_ALL_GAME_LOBBIES, JSON.stringify(this.lobby.getGameLobbies()));


            // Create lobby
            socket.on(Events.lobby.CREATE_GAME_LOBBY, function (data) =>
            {
                ServerUtilies.log(" Create lobby with name [" + data.name + "]");
                var newGameLobby = this.lobby.server_createGameLobby(data.name, data.nPlayers);

                //Once a new game lobby has been created, add the user who created it.
                socket.get(GameServer.SOCKET_USERID, function (err, userId) =>
                {
                    newGameLobby.addPlayer(userId);
                });


                this.io.sockets.emit(Events.client.UPDATE_ALL_GAME_LOBBIES, JSON.stringify(this.lobby.getGameLobbies()));

            });


            // PLAYER_JOIN Game lobby
            socket.on(Events.gameLobby.PLAYER_JOIN, function (gamelobbyId) =>{
              

                // Get the usersId
                socket.get(GameServer.SOCKET_USERID,  function (err, userId) =>
                {
                    var gamelobby: GameLobby = this.lobby.findGameLobby(gamelobbyId);
                    gamelobby.addPlayer(userId);
                });

            });


        });
    }

}

var serverInstance = new GameServer(8080);
serverInstance.init();





//When a user connections eg: refreshs the page, a person object is
//created for them and passed around to the other clients by the addNewPersonToWorld event
//socket.on('onConnectionCreateNewEnitiy', function(newPerson) {   

//  sig++;
//  newPerson.sig = sig;
//  socket.set('sig', sig);
//  console.log("First connection sig = " + sig);

//  newPerson.ip = socket.handshake.address.address;     
//  entities[sig] = newPerson;

// socket.emit('addNewPersonToWorld', 20);  
// socket.broadcast.emit('addNewPersonToWorld', 20);
//});

//socket.on('updatePerson', function(person){

//    socket.get('sig', function (err, playersig) {

//         socket.broadcast.emit('updatePersonInWorld', person);  
//         entities[playersig] = person

//    });

//});

// socket.on('disconnect', function (){
//	socket.get('sig', function (err, playerSig) {
//      		   entities[playerSig] = null 
//      		   socket.broadcast.emit('onDisconnectRemovePlayer', playerSig);	      		  
//      		});
// });



//});
