///<reference path="Game.ts"/>

window.onload = function () => {

    var game = new Game();

    var imagesToLoad = {
        background: 'data/img/wormsBackGround.png',
    };

    AssetManager.loadImages(imagesToLoad, function () {

        (function gameloop() {

           // stats.update();
            game.step();
            game.update();
            game.draw();

            window.requestAnimationFrame(gameloop);
        })();

    });

};