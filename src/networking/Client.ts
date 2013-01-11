///<reference path="../../external/socket.io-0.9.d.ts"/>
///<reference path="../system/Utilies.ts"/>
declare var io;

module Client
{
    export var socket;

    export function connectionToServer(ip,port)
    {
        try
        {
            var dest = ip + ":" + port;
            Logger.debug(" Client connecting to " + dest);
            socket = io.connect(dest);
            return true;

        } catch (e)
        {
            return false;
        }
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