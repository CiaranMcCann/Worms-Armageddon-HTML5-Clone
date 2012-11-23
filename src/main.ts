/**
 *  
 * Worms Armageddon HTML5 Clone 
 *
 * Main entry piont
 *
 *  License: Apache 2.0
 *  author:  Ciarán McCann
 *  url: http://www.ciaranmccann.me/
 */
///<reference path="Game.ts"/>
///<reference path="system/Graphics.ts"/>
///<reference path="gui/StartMenu.ts" />

$(document).ready(function () => {

    Settings.getSettingsFromUrl();

    if (!Settings.RUN_UNIT_TEST_ONLY)
    {
        var startMenu = new StartMenu();

        AssetManager.loadPriorityAssets(function ()
        {
            // Once we the names from wikiepa then we can create the game
            NameGenerator.init(function ()
            {
                var game = new Game();

                startMenu.onGameReady(function ()
                {
                    function gameloop()
                    {
                        Graphics.stats.update();
                        game.step();
                        game.update();
                        game.draw();
                        window.requestAnimationFrame(gameloop);
                    }
                    gameloop();

                });
            });
        });
    }

});