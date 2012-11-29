/**
 * CountDownTimer.js
 * This is encpluates the count down timer position in the bottom left hand couter
 * It also handles the switching of players when their time runs out. 
 *
 *  License: Apache 2.0
 *  author:  Ciarán McCann
 *  url: http://www.ciaranmccann.me/
 */
///<reference path="Main.ts"/>
///<reference path="Game.ts"/>
///<reference path="system/Timer.ts" />
///<reference path="Settings.ts" />

class CountDownTimer
{

    timer: Timer;
    previousSecound: number;

    constructor ()
    {
        this.timer = new Timer(Settings.PLAYER_TURN_TIME);
        this.previousSecound = this.timer.timePeriod;
    }

    update(players)
    {
        if(Settings.DEVELOPMENT_MODE)
            this.timer.pause();

        this.timer.update();
        var timeLeft = Math.floor(this.timer.getTimeLeft() / 1000);

        // Dont update the HTML element while 
        if (timeLeft != this.previousSecound)
        {
            if (timeLeft == 5)
            {
                AssetManager.sounds["hurry"].play();
            }


            this.previousSecound = timeLeft;
            $('#turnTimeCounter').html(timeLeft);
        
            if (timeLeft < Settings.TURN_TIME_WARING && timeLeft >= 0)
            {             
                $('#turnTimeCounter').css("background", "red");
                 AssetManager.sounds["TIMERTICK"].play(0.3);

            } else
            {
                $('#turnTimeCounter').css("background", "#808080");
            }

            if (this.timer.hasTimePeriodPassed())
            {
                GameInstance.nextPlayer();
            }
        }

    }

}