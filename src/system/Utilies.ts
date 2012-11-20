declare var $;

module Utilies
{

  

    export function random(min, max)
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    export function deleteFromCollection(collection, indexToRemove)
    {
        delete collection[indexToRemove];
        collection.splice(indexToRemove, 1);
    }

   

    export function isBetweenRange(value, rangeMax, rangeMin)
    {
        return value >= rangeMin && value <= rangeMax;
    }

    //export function isBetweenRangeTest()
    //{
    //    var t1 = isBetweenRange(3.3, 10, -10);
    //    var t2 = isBetweenRange(-2.3, 40, -3);
    //    var t3 = isBetweenRange(-25.3, 40, -3);

    //    if ( t1 == false || t2 == false || t3 == true)
    //    {
    //        Logger.error(" isBetweenRangeTestFailed ");
    //    } else
    //    {
    //        Logger.log("isBetweenTestPassed");
    //    }


    //};

    //var time;

    //export function timer(delay, func)
    //{

    //}


}




module Logger
{

    export var loggingActive = true;

    export function log(message)
    {
        if (loggingActive)
            console.info(message);
    }

    export function debug(message)
    {
        if (loggingActive)
            console.log(message);
    }

    export function error(message)
    {
        if (loggingActive)
            console.error(message);
    }
}

module keyboard
{

    var keys = [];

    (function ()
    {

        $(window).keydown(function (e)
        {
            keys[e.which] = true;
        });

        $(window).keyup(function (e)
        {
            delete keys[e.which];
        });

    })();

    export function isKeyDown(keyCode)
    {
        for (var key in keys)
        {
            if (key == keyCode)
                return true;
        }

        return false;
    }

}