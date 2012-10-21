///<reference path="Graphics.ts"/>
///<reference path="AssetManager.ts"/>
///<reference path="Physics.ts"/>
///<reference path="Terrain.ts"/>


class Game {

    canvas;
    ctx;
    terrain;

    constructor () {
        Graphics.init();
        this.init();
    }

    init() {

       this.canvas = Graphics.createCanvas();
       this.ctx = this.canvas.getContext("2d");   
       
       Physics.init(this.ctx);     
       this.terrain = new Terrain(this.canvas, AssetManager.images.background, Physics.world, Physics.worldScale);

    }

    update() {


    }

    step() {
       
       Physics.world.Step(
             1 / 60   //frame-rate
          ,  10       //velocity iterations
          ,  10       //position iterations
       );
       Physics.world.DrawDebugData();
       Physics.world.ClearForces();

    }

    draw() {
        //this.terrain.draw(this.ctx);
       // this.ctx.drawImage(AssetManager.images.background, 0, 0);
    }

}