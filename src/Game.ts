///<reference path="Graphics.ts"/>
///<reference path="AssetManager.ts"/>
///<reference path="Physics.ts"/>
///<reference path="Terrain.ts"/>
///<reference path="weapons/ThrowableWeapon.ts"/>
///<reference path="Worm.ts"/>
///<reference path="Utilies.ts"/>


class Game {

    terrainCanvas;
    terrainCanvasContext;

    actionCanvas;
    actionCanvasContext;

    terrain;
    weapons = [];
    worm : Worm;


    constructor () {
        Graphics.init();
        this.init();
    }

    init() {

        //Create Terrain canvas
        this.terrainCanvas = Graphics.createCanvas("terrain");
        this.terrainCanvasContext = this.terrainCanvas.getContext("2d");

        //Create action canvas
        this.actionCanvas = Graphics.createCanvas("action");
        this.actionCanvasContext = this.actionCanvas.getContext("2d");

        Physics.init(this.terrainCanvasContext);
        this.terrain = new Terrain(this.terrainCanvas, AssetManager.images.background, Physics.world, Physics.worldScale);

        window.addEventListener("click", function (evt) =>
        {
            this.terrain.addToDeformBatch(evt.pageX, evt.pageY, 40)

        }, false);
        
        this.worm = new Worm(12, 2, AssetManager.images.worm);
        
        for (var i = 0; i < 130; i++) {
            this.weapons[i] = new ThrowableWeapon(Utilies.random(12,40), -5, AssetManager.images.bananabomb);
        }

        window.addEventListener("keydown", function (evt) =>
        {
            this.worm.controls(event);

        }, false);
    }

    update() {

          for (var w in this.weapons) {
              this.weapons[w].update(this.terrain);
         }

          this.terrain.update();
    }

    step() {

        Physics.world.Step(
              (1 / 60)   
           , 10       //velocity iterations
           , 10       //position iterations
        );
        //Physics.world.DrawDebugData();
        Physics.world.ClearForces();

    }

    draw() {
       // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        //this.terrain.draw(this.ctx);

        this.actionCanvasContext.clearRect(0, 0, this.actionCanvas.width, this.actionCanvas.height);
        for (var w in this.weapons) {
            this.weapons[w].draw(this.actionCanvasContext);
        }
        this.worm.draw(this.actionCanvasContext);
    }

}