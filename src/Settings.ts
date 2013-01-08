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

    //Game vars
    export var PLAYER_TURN_TIME = 45 * 1000; // 60 secounds
    export var TURN_TIME_WARING = 5; // after 10 secounds warn player they are running out of time
   
    //General game settings
    export var SOUND = true;

    // development vars
    export var DEVELOPMENT_MODE = false; 
    export var REMOTE_ASSERT_SERVER = "http://www.ciaranmccann.me/fyp/";
    export var PHYSICS_DEBUG_MODE = false;
    export var RUN_UNIT_TEST_ONLY = !true;


    //Pasers commandline type arguments from the page url like this ?argName=value
    export function getSettingsFromUrl()
    {
        var argv = getUrlVars();
        var commands = ["physicsDebugDraw","devMode","unitTest","sound"]

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
           var testWindow = window.open('test.html', '|UnitTests', 'height=1000,width=700,top:100%');
           testWindow.location.reload(); // This is so if the window was left open it refreshs
            
        }

        if (argv[commands[3]] == "false")
        {
            SOUND = false;
        }

        Logger.log(" Notice: argv are as follows " + commands);
    }

    export function getUrlVars()
    {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value)
        {
            vars[key] = value;
        });
        return vars;
    }
}