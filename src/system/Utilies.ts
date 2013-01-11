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
///<reference path="Physics.ts" />
declare var $;


module Utilies
{

    //Allows for the copying of Object types into their proper types, used for copy constructer
    //for objects that are sent over the network. I have intergrated this function, into
    // the constructor of the Person object so it acts like C-style copy construction
    // WARNING: This creates a deep copy, so reference are not preserved
    export function copy(newObject, oldObject)
    {

        for (var member in oldObject)
        {
            // if the member is itself an object, then we most also call copy on that
            if (typeof (oldObject[member]) == "object")
            {
                newObject[member] = copy(newObject[member], oldObject[member])
            } else
            {
                // if its a primative member just assign it
                newObject[member] = oldObject[member];
            }
        }

        return newObject;
    };

    export function findByValue(needle, haystack, haystackProperity, )
    {

        for (var i = 0; i < haystack.length; i++)
        {
            if (haystack[i][haystackProperity] === needle)
            {
                return haystack[i];
            }
        }
        throw "Couldn't find object with proerpty " + haystackProperity + " equal to " + needle;
    }

    export function random(min, max)
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    export function pickRandom(collection)
    {
        return collection[random(0, collection.length - 1)];
    }

    var pickUnqineCollection = [];
    export function pickUnqine(collection, stringId: string)
    {
        if (pickUnqineCollection[stringId])
        {
            var items = pickUnqineCollection[stringId];

            if (items.length <= 0)
            {
                Logger.error("Out of unqine items in collection " + stringId);
                return;
            }

            var index = random(0, items.length - 1)
            var unqineItem = items[index];
            deleteFromCollection(items, index);
            return unqineItem;

        } else
        {
            pickUnqineCollection[stringId] = collection;
            return pickUnqine(collection, stringId);
        }
    }


    export function pickRandomSound(collection: string[])
    {
        var sound: Sound = AssetManager.sounds[collection[random(0, collection.length - 1)]];

        if (!sound.play)
        {
            Logger.warn(" Somthing looks dogoy with the sound object " + sound);
        }

        return sound;
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

    export function angleToVector(angle: number)
    {
        return new b2Vec2(Math.cos(angle), Math.sin(angle));
    }

    export function vectorToAngle(vector)
    {
        return Math.atan2(vector.y, vector.x);
    }

    export function toRadians(angleInDegrees: number)
    {
        return angleInDegrees * (Math.PI / 180);
    }

    export function toDegrees(angleInRdains: number)
    {
        return angleInRdains * (180 / Math.PI);
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

    export function log(message)
    {
        if (Settings.DEVELOPMENT_MODE || Settings.LOG)
            console.info(message);
    }

    export function warn(message)
    {
        if (Settings.DEVELOPMENT_MODE || Settings.LOG)
         console.warn(message);
    }

    export function debug(message)
    {
        if (Settings.DEVELOPMENT_MODE || Settings.LOG )
            console.log(message);
    }

    export function error(message)
    {
        if (Settings.DEVELOPMENT_MODE || Settings.LOG)
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

    export function isKeyDown(keyCode, actLikeKeyPress = false)
    {
        for (var key in keys)
        {
            if (key == keyCode)
            {
                if (actLikeKeyPress)
                {
                    delete keys[key]
                }

                return true;
            }
        }

        return false;
    }

}