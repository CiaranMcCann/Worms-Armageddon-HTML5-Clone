///<reference path="Game.ts"/>
///<reference path="Graphics.ts"/>

window.onload = function () => {

    AssetManager.loadPriorityAssets(function () {

        var game = new Game();

        function gameloop() {

            Graphics.stats.update();
            game.step();
            game.update();
            game.draw();
            window.requestAnimationFrame(gameloop);
         }
         gameloop();

    });

};