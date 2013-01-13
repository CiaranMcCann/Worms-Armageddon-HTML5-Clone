///<reference path="../system/Utilies.ts"/>
declare var io;

module Client
{
    export var socket;
    export var id;

    class InstructionChain
    {
        instructionChain : string[];
        args; // array of anything

        constructor(instructionChain : string = "" , args = [])
        {
            this.instructionChain = instructionChain.split('.');
            this.args = args;

        }

        call(objectToApplyInstruction)
        {
            var obj = objectToApplyInstruction;
            var objMethod;

            if (this.instructionChain.length > 1)
            {
                for (var i = 0; i < this.instructionChain.length - 1; i++)
                {
                    obj = obj[this.instructionChain[i]]
                }
                objMethod = this.instructionChain[this.instructionChain.length-1]


            } else
            {
                obj = objectToApplyInstruction;
                objMethod = this.instructionChain[0];
            }

            obj[objMethod].call(obj, this.args);
        }

    }

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

            socket.on(Events.client.WORM_ACTION, function (packet) =>
            {
               var instructionSet : InstructionChain = Utilies.copy(new InstructionChain(), packet);

               var worm = GameInstance.state.getCurrentPlayerObject().getTeam().getCurrentWorm()
               instructionSet.call(worm);

                
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