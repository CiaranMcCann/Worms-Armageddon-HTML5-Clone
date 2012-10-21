///<reference path="Game.ts"/>

window.onload = function () => {


    var imagesToLoad = {
        background: 'data/img/wormsBackGround.png',
    };

    AssetManager.loadImages(imagesToLoad, function () {

        var game = new Game();

        (function gameloop() {

           // stats.update();
            game.step();
            game.update();
            game.draw();

            window.requestAnimationFrame(gameloop);
        })();

    });

};