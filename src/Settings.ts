/**
 *  Global settings for the whole game
 *
 *  License: Apache 2.0
 *  author:  Ciarán McCann
 *  url: http://www.ciaranmccann.me/
 */
///<reference path="system/Utilies.ts" />

module Settings
{
    export var PLAYER_TURN_TIME = 20 * 1000; // 60 secounds
    export var TURN_TIME_WARING = 5; // after 10 secounds warn player they are running out of time
    export var DEVELOPMENT_MODE = !false; 
    export var REMOTE_ASSERT_SERVER = "http://www.ciaranmccann.me/fyp/";
    export var PHYSICS_DEBUG_MODE = false;

    //Pasers commandline type arguments from the page url like this ?argName=value
    export function getSettingsFromUrl()
    {
        var argv = Utilies.getUrlVars();
        var commands = ["physicsDebugDraw","devMode","unitTest"]

        if (argv[commands[0]] == "true")
        {
            PHYSICS_DEBUG_MODE = true;
        }

        if (argv[commands[1]] == "true")
        {
            DEVELOPMENT_MODE = true;
        }

        if (argv[commands[2]] == "true")
        {
            window.open('test.html', 'name', 'height=1000,width=700,top:100%');
        }

        Logger.log(" Notice: argv are as follows " + commands);
    }
}