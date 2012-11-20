///<reference path="Game.ts"/>
///<reference path="system/Graphics.ts"/>
///<reference path="gui/StartMenu.ts" />

$(document).ready(function () => {

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

});