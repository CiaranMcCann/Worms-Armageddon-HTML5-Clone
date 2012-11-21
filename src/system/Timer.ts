//Handy Timer class, as I use timelapse alot thoughout
// the codebase and window.SetTimeOut() isn't as fexible as I would like
class Timer
{
    timeSinceLastUpdate;
    delta;
    timePeriod;

    constructor(timePeriod)
    {
        this.delta = 0;
        this.timePeriod = timePeriod;
        this.timeSinceLastUpdate = 0;
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

    update()
    {
        this.delta += Date.now() - this.timeSinceLastUpdate;
        this.timeSinceLastUpdate = Date.now();
    }
}