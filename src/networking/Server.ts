///<reference path="../../external/socket.io-0.9.d.ts"/>
///<reference path="../system/Utilies.ts"/>

import Lobby = module("./Lobby");
import Events = module("./Events");
import Utilies = module("./ServerUtilies");


var io = require('socket.io').listen(1337);
var lobbys : Lobby.Lobby[] = [];
var userCount = 0;

var SOCKET_USERID = 'userId';

io.sockets.on('connection', function (socket : Socket)
{

    //When any user connects to the node server we set their socket an ID
    //so we can idefnitny them unqine in their dealings with the server
    socket.set(SOCKET_USERID, userCount, function ()
    {
        Utilies.log(" User connected and assigned ID [" + userCount + "]");
    });
    userCount++;

    
    // Create lobby
    socket.on(Events.server.CREATE_LOBBY, function (name)
    {
        Utilies.log(" Create lobby with name [" + name + "]");
        var newLobby = new Lobby.Lobby(name);
        lobbys.push(newLobby);

        socket.broadcast.emit(Events.client.NEW_LOBBY_CREATED, JSON.stringify(newLobby));

    });
    
    
    
    // PLAYER_JOIN lobby
    socket.on(Events.lobby.PLAYER_JOIN, function (lobbyId) =>{
        var userId;

        // Get the usersId
        socket.get(SOCKET_USERID, userId, function ()
        {
            var lobby : Lobby.Lobby = Utilies.findByValue(userId, lobbys, "lobbyId");
            lobby.addPlayer(userId);
        });

    });


});






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
