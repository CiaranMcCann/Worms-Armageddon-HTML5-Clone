/**
 * NetworkedTimer.js
 *
 *  License: Apache 2.0
 *  author:  Ciarán McCann
 *  url: http://www.ciaranmccann.me/
 */
///<reference path="../system/Timer.ts"/>
///<reference path="Events.ts"/>
///<reference path="Client.ts"/>

class NetworkTimer extends Timer
{

    currentServerTime : number; // When last checked
    packetRateTimer: Timer;

    constructor(gameTurnTimeDuraction)
    {
        super(gameTurnTimeDuraction);
        this.packetRateTimer = new Timer(1000);
        this.currentServerTime = Date.now();
    }

    update()
    {
        this.packetRateTimer.update();
        super.update();

        if (this.packetRateTimer.hasTimePeriodPassed())
        {
            Client.socket.emit(Events.client.GET_GAME_TIME, '',function (data) =>
            {
                this.currentServerTime = data;
            });
        }
    }
    

    //override
    getTimeNow()
    {             
        return this.currentServerTime;
    }

}