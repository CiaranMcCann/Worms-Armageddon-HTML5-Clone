///<reference path="Game.ts"/>
///<reference path="Graphics.ts"/>

window.onload = function () => {


    var imagesToLoad = {
        background: 'data/img/wormsBackGround.png',
        bananabomb: 'data/img/bananabomb.png',
        worm: 'data/img/worm.png',
        bggradient: 'data/img/graident.png'
    };

    var priorityAudio = [
        "data/sounds/boring.wav"
    ]
        

    AssetManager.loadPriorityAssets(priorityAudio, imagesToLoad, function () {

        Sound.play(AssetManager.sounds.boring, 20);

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