///<reference path="Graphics.ts"/>
///<reference path="AssetManager.ts"/>
///<reference path="Physics.ts"/>
///<reference path="Terrain.ts"/>
///<reference path="weapons/ThrowableWeapon.ts"/>


class Game {

    terrainCanvas;
    terrainCanvasContext;

    actionCanvas;
    actionCanvasContext;

    terrain;
    weapon : ThrowableWeapon;

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
            this.terrain.deformRegion(evt.pageX, evt.pageY, 40)

        }, false);
        
        this.weapon = new ThrowableWeapon(10, -10, AssetManager.images.bananabomb);
    }

    update() {


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
        this.weapon.draw(this.actionCanvasContext);
    }

}