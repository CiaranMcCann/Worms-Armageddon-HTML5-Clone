///<reference path="../../external/socket.io-0.9.d.ts"/>
module Client
{
    export var socket;

    export function connectionToServer(ip,port)
    {
       var dest = ip + ":" + port;
       Logger.debug(" Client connecting to " + dest);
       socket = io.connect(dest);
    }

}

//(function ()
//{
    
//   var socket = io.connect('96.126.111.211:1337');
//    //socket.emit('onConnectionCreateNewEnitiy', 20);

//   console.log(" doing socket stuff ");
//    socket.on('addNewPersonToWorld', function ()
//    {
//        console.log(" Recived addNewPersonToWorld event ");
//    });

//}).call(this);