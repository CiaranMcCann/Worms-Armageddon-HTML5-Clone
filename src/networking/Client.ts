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