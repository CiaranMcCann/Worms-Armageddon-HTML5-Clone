///<reference path="system/Graphics.ts"/>
///<reference path="system/AssetManager.ts"/>
///<reference path="system/Physics.ts"/>
///<reference path="Terrain.ts"/>
///<reference path="weapons/ThrowableWeapon.ts"/>
///<reference path="Worm.ts"/>
///<reference path="system/Utilies.ts"/>
///<reference path="weapons/ProjectileWeapon.ts"/>
///<reference path="gui/WeaponsMenu.ts" />
///<reference path="Player.ts" />
///<reference path="system/Timer.ts" />
///<reference path="Settings.ts" />
///<reference path="CountDownTimer.ts" />


class Game
{

    terrainCanvas;
    terrainCanvasContext;

    actionCanvas;
    actionCanvasContext;

    terrain;
    weapons;
    players: Player[];

    weaponMenu: WeaponsMenu;

    gameTimer: CountDownTimer;

    static soundOn;
    static currentPlayer;
    static terrain: Terrain;

    constructor ()
    {
        Graphics.init();

        Game.soundOn = true;
        Game.currentPlayer = 0;


        this.weaponMenu = new WeaponsMenu();
        this.gameTimer = new CountDownTimer();

        //Create Terrain canvas
        this.terrainCanvas = Graphics.createCanvas("terrain");
        this.terrainCanvasContext = this.terrainCanvas.getContext("2d");

        //Create action canvas
        this.actionCanvas = Graphics.createCanvas("action");
        this.actionCanvasContext = this.actionCanvas.getContext("2d");
        this.actionCanvasContext.font = 'bold 14px Sans-Serif';

        Physics.init(this.terrainCanvasContext);
        this.terrain = new Terrain(this.terrainCanvas, AssetManager.images["wormsBackGround"], Physics.world, Physics.worldScale);

        Game.terrain = this.terrain; // Allows the terrain to be accessed any where

        window.addEventListener("click", function (evt: any) =>
        {
            this.terrain.addToDeformBatch(evt.pageX, evt.pageY, 35)

        }, false);

        this.players = [];
        for (var i = 0; i < 2; i++)
        {
            this.players.push(new Player());
        }


        //TODO Remove this first sprint demo code after
        this.weapons = [];
        for (var i = 0; i < 5; i++) {
           this.weapons[i] = new ProjectileWeapon(Utilies.random(15,40), Utilies.random(-30,0), AssetManager.images["bananabomb"], this.terrain);
        }

        // for (var i = 2; i < 5; i++) {
        //    this.weapons[i] = new ThrowableWeapon(Utilies.random(10,40), Utilies.random(-10,2), AssetManager.images["bananabomb"], this.terrain);
        //}

    }


    update()
    {

         for (var w in this.weapons) {
             this.weapons[w].update();
        }
        this.players[Game.currentPlayer].update();

        for (var player in this.players)
        {

            this.players[player].team.update();
        }

        this.terrain.update();

        this.gameTimer.update(this.players);

    }

    step()
    {

        Physics.world.Step(
              (1 / 60)
           , 10       //velocity iterations
           , 10       //position iterations
        );
        //Physics.world.DrawDebugData();
        //Physics.world.ClearForces();

    }

    draw()
    {
        this.actionCanvasContext.clearRect(0, 0, this.actionCanvas.width, this.actionCanvas.height);

         var weaponsLenght = this.weapons.length;
        for (var i = 0; i <  weaponsLenght; i++)
        {
            this.weapons[i].draw(this.actionCanvasContext);
        }

        for (var player in this.players)
        {
            this.players[player].draw(this.actionCanvasContext);
        }
    }

}