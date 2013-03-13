/**
 *  Shotgun.js
 *
 *  License: Apache 2.0
 *  author:  Ciaran McCann
 *  url: http://www.ciaranmccann.me/
 */
///<reference path="../system/Graphics.ts"/>
///<reference path="../system/AssetManager.ts"/>
///<reference path="../system/Physics.ts"/>
///<reference path="../environment/Terrain.ts"/>
///<reference path="BaseWeapon.ts"/>
///<reference path="../Game.ts"/>
///<reference path="../Main.ts"/>
///<reference path="../animation/Sprite.ts"/>
///<reference path="../animation/Effects.ts"/>

class Shotgun extends RayWeapon
{
    fireAnimations: SpriteDefinition[];
    fireAnimationIndex: number;
    animationSheetChangeTimer: Timer;
    shotsTaken;

    constructor(ammo)
    {
        super(
            "Shotgun",
            ammo,
            Sprites.weaponIcons.shotgun,
            Sprites.worms.shotgunTakeOut,
            Sprites.worms.aimingShotgun
       )

        //Collection of three sprite sheets which
        // we will switch between to create the fire animation
        this.fireAnimations = [Sprites.worms.shotgunFirePump, Sprites.worms.aimingShotgun, Sprites.worms.shotgunFireAnimation1];
        this.fireAnimationIndex = 0;

        //Amount of the terrain to cut out
        this.damageToTerrainRadius = 30; //px

        //Health removed from worm when shot hits
        this.damgeToWorm = 30;

        this.forceScaler = 40;

        this.animationSheetChangeTimer = new Timer(300);

        this.shotsTaken = 0;

    }


    activate(worm: Worm)
    {
        if (this.getIsActive() == false)
        {
            super.activate(worm);

            this.animationSheetChangeTimer.reset();
            this.fireAnimationIndex = 0;
            AssetManager.getSound("SHOTGUNRELOAD").play(1, 0.3);
            this.shotsTaken++;
        }
    }

    update()
    {
        if (super.update())
        {
            this.animationSheetChangeTimer.update();

            if (this.animationSheetChangeTimer.hasTimePeriodPassed())
            {             
                this.worm.swapSpriteSheet(this.fireAnimations[this.fireAnimationIndex]);
                this.fireAnimationIndex++;
            }


            if (this.fireAnimationIndex >= this.fireAnimations.length)
            {
                var hitPiont = Physics.shotRay(this.worm.body.GetPosition(), this.worm.target.getTargetDirection().Copy());
                if (hitPiont)
                {
                    Effects.explosion(hitPiont,
                        this.damageToTerrainRadius,
                        1,
                        this.forceScaler,
                        this.damgeToWorm,
                        this.worm,
                        AssetManager.getSound("ShotGunFire"));
                } else
                {
                    //Even if we miss the shot make a sound
                    AssetManager.getSound("ShotGunFire").play();
                }
                this.animationSheetChangeTimer.pause();
                this.fireAnimationIndex = 0;

                setTimeout(function () => {
                    this.setIsActive(false);
                    this.worm.swapSpriteSheet(this.fireAnimations[this.fireAnimationIndex]);

                    if (this.shotsTaken >= 2)
                    {
                        this.shotsTaken = 0;
                        GameInstance.state.tiggerNextTurn();
                    }

                }, 400);


            }

        }



    }