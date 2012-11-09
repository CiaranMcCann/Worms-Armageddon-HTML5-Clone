///<reference path="Game.ts"/>
///<reference path="Graphics.ts"/>
///<reference path="gui/SplashScreen.ts" />

$(document).ready(function() => {

    var splashScreen = new SplashScreen(document.body);
    splashScreen.show();

    AssetManager.loadPriorityAssets(function () {
        
        var game = new Game();
        splashScreen.hide(function ()
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