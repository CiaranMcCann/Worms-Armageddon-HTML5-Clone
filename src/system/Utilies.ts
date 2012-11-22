/**
 * Utitles 
 * This namespace contains helper functions that I use a lot around the code base
 * or encapluate snippets of code I use a lot in the codebase though by naming it 
 * asa function gives the code more readablity.
 *
 * Logger
 * Just wraps the console.log functions alloing me to switch them on and off easily
 *
 * Keyboard
 * Keeps track of which keys are pressed and allows for polling in gameloop
 * which is faster then event based input.
 *
 *  License: Apache 2.0
 *  author:  Ciarán McCann
 *  url: http://www.ciaranmccann.me/
 */
///<reference path="../Settings.ts" />
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
}


module Logger
{

    export var loggingActive = true; // !Settings.DEVELOPMENT_MODE;

    export function log(message)
    {
        if (loggingActive)
            console.info(message);
    }

     export function warn(message)
    {
        if (loggingActive)
            console.warn(message);
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