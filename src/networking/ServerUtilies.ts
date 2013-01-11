///<reference path="ServerSettings.ts"/>

// HACK
// Had to give up the benfits of types in this instance, as a problem with the way ES6 proposal module system
// works with Node.js modules. http://stackoverflow.com/questions/13444064/typescript-conditional-module-import-export
try
{
    var ServerSettings = require('./ServerSettings');
} catch (e) { }

module ServerUtilies
{
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

    export function createToken()
    {
        return Math.random().toString(36).substr(2);
    }


    export function log(message)
    {
        if (ServerSettings.DEVELOPMENT_MODE)
            console.info(message);
    }

    export function warn(message)
    {
        //if (Settings.DEVELOPMENT_MODE)
        // console.warn(message);
    }

    export function debug(message)
    {
        if (ServerSettings.DEVELOPMENT_MODE)
            console.log(message);
    }

    export function error(message)
    {
        if (ServerSettings.DEVELOPMENT_MODE)
            console.error(message);
    }
}

//Hack
declare var exports: any;
if (typeof exports != 'undefined')
{
    (module).exports = ServerUtilies;
}