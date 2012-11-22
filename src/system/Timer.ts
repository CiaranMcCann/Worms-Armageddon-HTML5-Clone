//Handy Timer class, as I use timelapse alot thoughout
// the codebase and window.SetTimeOut() isn't as fexible as I would like
class Timer
{
    timeSinceLastUpdate;
    delta;
    timePeriod;
    isTimerPaused;

    constructor(timePeriod)
    {
        this.delta = 0;
        this.timePeriod = timePeriod;
        this.timeSinceLastUpdate = 0;
        this.isTimerPaused = false;
    }

    pause()
    {
        this.isTimerPaused = true;
    }

    hasTimePeriodPassed()
    {
        if (this.delta > this.timePeriod)
        {
            this.delta = 0;
            return true;
        } else
        {
            return false;
        }
    }

    reset()
    {
        this.delta = 0;
    }

    getTimeLeft()
    {
        return this.timePeriod - this.delta;
    }

    update()
    {
        if (this.isTimerPaused == false)
        {
            this.delta += Date.now() - this.timeSinceLastUpdate;
            this.timeSinceLastUpdate = Date.now();
        }
    }
}