/**
 * Timer.js
 * Handy Timer class, as I use timelapses alot thoughout
 * the codebase and window.SetTimeOut() isn't as fexible as I would like
 *
 *  License: Apache 2.0
 *  author:  Ciarán McCann
 *  url: http://www.ciaranmccann.me/
 */
class Timer
{
    timeSinceLastUpdate;
    delta;
    timePeriod;
    isTimerPaused;

    constructor (timePeriod)
    {
        this.delta = 0;
        this.timePeriod = timePeriod;
        this.timeSinceLastUpdate = this.getTimeNow();
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
        this.timeSinceLastUpdate = this.getTimeNow();
        this.isTimerPaused = false;
    }

    getTimeLeft()
    {
        return this.timePeriod - this.delta;
    }

    getTimeLeftInSec()
    {
        return (this.timePeriod - this.delta) / 60;
    }
    
    getTimeNow()
    {
        return Date.now();
    }

    update()
    {
        if (this.isTimerPaused == false)
        {
            this.delta += this.getTimeNow() - this.timeSinceLastUpdate;
            this.timeSinceLastUpdate = this.getTimeNow();
        }
    }
}