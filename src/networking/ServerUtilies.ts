
//I was unable to place utilies in a common (server/client) file due to the way Node.js modules work
// and how typescript modules work. 

import ServerSettings = module("./ServerSettings");

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


export function log(message)
{
    if (ServerSettings.ServerSettings.DEVELOPMENT_MODE)
        console.info(message);
}

export function warn(message)
{
    //if (Settings.DEVELOPMENT_MODE)
    // console.warn(message);
}

export function debug(message)
{
    if (ServerSettings.ServerSettings.DEVELOPMENT_MODE)
        console.log(message);
}

export function error(message)
{
    if (ServerSettings.ServerSettings.DEVELOPMENT_MODE)
        console.error(message);
}
