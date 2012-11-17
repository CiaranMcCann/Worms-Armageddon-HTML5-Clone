///<reference path="Game.ts"/>
///<reference path="Graphics.ts"/>
///<reference path="gui/StartMenu.ts" />

$(document).ready(function() => {

    var startMenu = new StartMenu();

    AssetManager.loadPriorityAssets(function () {
        
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