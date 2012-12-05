/**
 * Game.js
 * This is the main game object which controls gameloop and basically everything in the game
 *
 *  License: Apache 2.0
 *  author:  Ciarán McCann
 *  url: http://www.ciaranmccann.me/
 */
///<reference path="system/Camera.ts"/>
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

    x;
    y;

    camera: Camera;


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

        Physics.init(this.actionCanvasContext);
        var lvl = AssetManager.images["level2"];

        this.terrain = new Terrain(this.terrainCanvas, lvl, Physics.world, Physics.worldScale);

        this.camera = new Camera(this.terrain.getWidth(), this.terrain.getHeight(),  this.terrainCanvas.width, this.terrainCanvas.height);



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

         $("#action").mousemove(function(e) => {
             
             if (this.weaponMenu.isVisable == false)
             {
                 this.camera.panToX(Math.floor(e.pageX) * 2);
                 this.camera.panToY(Math.floor(e.pageY) * 2);
             }


             
        });

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
        //if(this.getCurrentPlayerObject().

        if (this.currentPlayerIndex + 1 == this.players.length)
        {
            this.currentPlayerIndex = 0;
        }
        else
        {
            this.currentPlayerIndex++;
            this.getCurrentPlayerObject().getTeam().updateCurrentWorm();
        }
    }

    checkForEndGame()
    {
        var playersStillLive = [];
        for (var player in this.players)
        {
            if (this.players[player].getTeam().isTeamDie() == false)
            {
                playersStillLive.push(this.players[player]);
            }
        }

        if (playersStillLive.length == 1)
        {
           playersStillLive[0].getTeam().winner();
           playersStillLive[0].getTeam().update();
           return true;
        }

        return false;
    }

    update()
    {
        if (this.isStarted)
        {
            //if the game has ended don't update anything but the
            // winning player and the particle effects.
            if (this.checkForEndGame() == false)
            {

                this.getCurrentPlayerObject().update();
                for (var player in this.players)
                {
                    this.players[player].getTeam().update();
                }

                this.terrain.update();
                this.gameTimer.update(this.players);

                this.camera.update();
            }

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
            {
              //  this.actionCanvasContext.save();
              //  this.actionCanvasContext.translate(-this.x, -this.y);
                Physics.world.DrawDebugData();
               // this.actionCanvasContext.restore();
            }
        }

        //Physics.world.ClearForces();
    }

    draw()
    {
       if (!Settings.PHYSICS_DEBUG_MODE)
       this.actionCanvasContext.clearRect(0, 0, this.actionCanvas.width, this.actionCanvas.height);

        this.actionCanvasContext.save();
        this.actionCanvasContext.translate(-this.camera.getX(), -this.camera.getY());

        for (var player in this.players)
        {
            this.players[player].draw(this.actionCanvasContext);
        }

        this.terrain.draw();

        this.particleEffectMgmt.draw(this.actionCanvasContext);

        this.actionCanvasContext.restore();
    }

}