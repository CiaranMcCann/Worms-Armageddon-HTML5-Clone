///<reference path="../system/Utilies.ts"/>
declare var io;

module Client
{
    export var socket;
    export var id;

    export function connectionToServer(ip,port)
    {
        try
        {
            var dest = ip + ":" + port;
            Logger.debug(" Client connecting to " + dest);
            socket = io.connect(dest);

            socket.on(Events.client.ASSIGN_USER_ID, function (id) =>
            {
                Logger.debug(" Your have been assigned an id " + id);
                Client.id = id;
            });

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