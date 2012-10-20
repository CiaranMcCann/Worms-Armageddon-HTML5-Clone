///<reference path="Graphics.ts"/>
///<reference path="AssetManager.ts"/>


class Game {

    canvas;
    ctx;

    constructor () {
        Graphics.init();
        this.init();
    }

    init() {

       this.canvas = Graphics.createCanvas();
       this.ctx = this.canvas.getContext("2d");      

    }

    update() {


    }

    step() {
        console.log("FPS");

    }

    draw() {
        this.ctx.drawImage(AssetManager.images.background, 0, 0);
    }

}