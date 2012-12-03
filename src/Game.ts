/**
 * Game.js
 * This is the main game object which controls gameloop and basically everything in the game
 *
 *  License: Apache 2.0
 *  author:  Ciarán McCann
 *  url: http://www.ciaranmccann.me/
 */
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
///<reference path="animation/SpriteDefinitions.ts" />
///<reference path="animation/ParticleEffect.ts"/>
///<reference path="animation/ParticleEffectManager.ts"/>
///<reference path="gui/HealthMenu.ts"/>

class Game
{
    terrainCanvas;
    terrainCanvasContext;

    actionCanvas;
    actionCanvasContext;

    terrain: Terrain;
    players: Player[];

    weaponMenu: WeaponsMenu;
    healthMenu: HealthMenu;

    gameTimer: CountDownTimer;
    currentPlayerIndex: number;

    isStarted: bool;
    particleEffectMgmt: ParticleEffectManager;


    constructor ()
    {
        Graphics.init();

        this.currentPlayerIndex = 0;


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
        this.terrain = new Terrain(this.terrainCanvas, AssetManager.images["level2"], Physics.world, Physics.worldScale);

        this.players = [];
        for (var i = 0; i < 2; i++)
        {
            this.players.push(new Player());
        }

        this.isStarted = false;
        //window.addEventListener("click", function (evt: any) =>
        //{
        //    //this.terrain.addToDeformBatch(evt.pageX, evt.pageY, 35)
        //    this.particleEffectMgmt.add(new ParticleEffect(evt.pageX, evt.pageY));

        //}, false);

        this.particleEffectMgmt = new ParticleEffectManager();

    }

    start()
    {
        this.gameTimer.timer.reset();
        this.isStarted = true;
        this.healthMenu = new HealthMenu(this.players);
    }

    getCurrentPlayerObject()
    {
        return this.players[this.currentPlayerIndex];
    }

    nextPlayer()
    {
        if (this.currentPlayerIndex + 1 == this.players.length)
        {
            this.currentPlayerIndex = 0;
        }
        else
        {
            this.currentPlayerIndex++;
        }
    }

    update()
    {
        if (this.isStarted)
        {
            this.getCurrentPlayerObject().update();

            for (var player in this.players)
            {
                this.players[player].team.update();
            }

            this.terrain.update();

            this.gameTimer.update(this.players);

            this.particleEffectMgmt.update();
        }

    }

    step()
    {
        if (this.isStarted)
        {
            Physics.world.Step(
                  (1 / 60)
               , 10       //velocity iterations
               , 10       //position iterations
            );

            if (Settings.PHYSICS_DEBUG_MODE)
                Physics.world.DrawDebugData();
        }

        //Physics.world.ClearForces();
    }

    draw()
    {
        this.actionCanvasContext.clearRect(0, 0, this.actionCanvas.width, this.actionCanvas.height);

        for (var player in this.players)
        {
            this.players[player].draw(this.actionCanvasContext);
        }

         this.particleEffectMgmt.draw(this.actionCanvasContext);
    }

}