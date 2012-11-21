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

        this.timer.update();
        var timeLeft = Math.floor(this.timer.getTimeLeft() / 1000);

        if (timeLeft != this.previousSecound)
        {
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
                if (Game.currentPlayer + 1 == players.length)
                {
                    Game.currentPlayer = 0;
                }
                else
                {
                    Game.currentPlayer++;
                }
            }
        }

    }

}