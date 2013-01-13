///<reference path="../system/Utilies.ts"/>
///<reference path="InstructionChain.ts"/>
declare var io;

module Client
{
    export var socket;
    export var id;


    export function connectionToServer(ip, port)
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

            socket.on(Events.client.ACTION, function (packet) =>
            {
               var instructionSet : InstructionChain = Utilies.copy(new InstructionChain(), packet);
               instructionSet.call(GameInstance);
                
            });

            return true;

        } catch (e)
        {
            return false;
        }
    }

    export function sendActionToAll(event,method,args = []){

        var packet = new InstructionChain(method, args);

        if (GameInstance.gameType == Game.types.ONLINE_GAME)
        {
            Client.socket.emit(event, packet);
        }
    }

}