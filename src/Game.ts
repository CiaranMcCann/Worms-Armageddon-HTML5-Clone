///<reference path="Graphics.ts"/>
///<reference path="AssetManager.ts"/>
///<reference path="Physics.ts"/>
///<reference path="Terrain.ts"/>
///<reference path="weapons/ThrowableWeapon.ts"/>
///<reference path="Worm.ts"/>
///<reference path="Utilies.ts"/>
///<reference path="weapons/ProjectileWeapon.ts"/>
///<reference path="gui/WeaponsMenu.ts" />

class Game {

    terrainCanvas;
    terrainCanvasContext;

    actionCanvas;
    actionCanvasContext;

    terrain;
    weapons;
    worm : Worm;

    weaponMenu: WeaponsMenu;

    static soundOn;
    static currentPlayer;

    constructor () {
        Graphics.init();

        Game.soundOn = true;
        Game.currentPlayer = 0;

        this.weaponMenu = new WeaponsMenu();
 
        //Create Terrain canvas
        this.terrainCanvas = Graphics.createCanvas("terrain");
        this.terrainCanvasContext = this.terrainCanvas.getContext("2d");

        //Create action canvas
        this.actionCanvas = Graphics.createCanvas("action");
        this.actionCanvasContext = this.actionCanvas.getContext("2d");
        this.actionCanvasContext.font  = 'bold 14px Sans-Serif';

        Physics.init(this.terrainCanvasContext);
        this.terrain = new Terrain(this.terrainCanvas, AssetManager.images["wormsBackGround"], Physics.world, Physics.worldScale);

        window.addEventListener("click", function (evt : any) =>
        {
            this.terrain.addToDeformBatch(evt.pageX, evt.pageY, 35)

        }, false);
        
        this.worm = new Worm(32, 2);
        
        //TODO Remove this first sprint demo code after
        this.weapons = [];
        for (var i = 0; i < 50; i++) {
           //this.weapons[i] = new ThrowableWeapon(Utilies.random(15,40), Utilies.random(-30,0), AssetManager.images["bananabomb"], this.terrain);
        }

        // for (var i = 2; i < 5; i++) {
        //    this.weapons[i] = new ThrowableWeapon(Utilies.random(10,40), Utilies.random(-10,2), AssetManager.images["bananabomb"], this.terrain);
        //}
    }

    update() {

          for (var w in this.weapons) {
              this.weapons[w].update();
         }

          this.terrain.update();
          this.worm.update();
    }

    step() {

        Physics.world.Step(
              (1 / 60)   
           , 10       //velocity iterations
           , 10       //position iterations
        );
      // Physics.world.DrawDebugData();
        //Physics.world.ClearForces();

    }

    draw() {
        this.actionCanvasContext.clearRect(0, 0, this.actionCanvas.width, this.actionCanvas.height);
       
        var weaponsLenght = this.weapons.length;
        for (var i = 0; i <  weaponsLenght; i++)
        {
            this.weapons[i].draw(this.actionCanvasContext);
        }
        this.worm.draw(this.actionCanvasContext);
    }

}