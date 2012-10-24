///<reference path="Game.ts"/>
///<reference path="Graphics.ts"/>

window.onload = function () => {


    var imagesToLoad = {
        background: 'data/img/wormsBackGround.png',
        bananabomb: 'data/img/bananabomb.png',
        worm: 'data/img/worm.png'
    };

    AssetManager.loadImages(imagesToLoad, function () {

        var game = new Game();

        (function gameloop() {
            
            Graphics.stats.update();
            game.step();
            game.update();
            game.draw();

            window.requestAnimationFrame(gameloop);
        })();

    });

};