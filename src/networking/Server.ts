///<reference path="../../external/socket.io-0.9.d.ts"/>
///<reference path="ServerUtilies.ts"/>
///<reference path="GameLobby.ts"/>
///<reference path="Events.ts"/>


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

} catch (e) { }


var io = require('socket.io').listen(1337);
var lobbys: GameLobby[] = [];
var userCount = 0;

var SOCKET_USERID = 'userId';

io.sockets.on('connection', function (socket: Socket)
{

    //When any user connects to the node server we set their socket an ID
    //so we can idefnitny them unqine in their dealings with the server
    socket.set(SOCKET_USERID, userCount, function () =>
    {
        Events.client.JOIN_GAME_LOBBY;
        
        ServerUtilies.log(" User connected and assigned ID [" + userCount + "]");
    });
    userCount++;


    // Create lobby
    socket.on(Events.lobby.CREATE_GAME_LOBBY, function (name) =>
    {
        ServerUtilies.log(" Create lobby with name [" + name + "]");
        var newLobby = new GameLobby(name);

        lobbys.push(newLobby);

        socket.broadcast.emit(Events.client.NEW_LOBBY_CREATED, JSON.stringify(newLobby));

    });



    // PLAYER_JOIN Game lobby
    socket.on(Events.gameLobby.PLAYER_JOIN, function (gamelobbyId) =>{
        var userId;

        // Get the usersId
        socket.get(SOCKET_USERID, userId, function ()
        {
            var lobby: GameLobby = ServerUtilies.findByValue(userId, lobbys, "lobbyId");
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
