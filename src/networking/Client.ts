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

            socket.on(Events.client.UPDATE, function (packet) =>
            {
                try
                {
                    var physicsDataPacket = new PhysiscsDataPacket(packet);
                    physicsDataPacket.override(Physics.fastAcessList);

                } catch (e){}
            });

            return true;

        } catch (e)
        {
            return false;
        }
    }

    var packetRateLimiter: Timer = new Timer(300);
    export function sendRateLimited(event, packet){

        packetRateLimiter.update();

        if (GameInstance.gameType == Game.types.ONLINE_GAME && packetRateLimiter.hasTimePeriodPassed())
        {
            Client.socket.emit(event, packet);
        }
    }

    export function sendImmediately(event, packet, rateLimiter = 0){

        if (GameInstance.gameType == Game.types.ONLINE_GAME)
        {
            Client.socket.emit(event, packet);
        }
    }

}