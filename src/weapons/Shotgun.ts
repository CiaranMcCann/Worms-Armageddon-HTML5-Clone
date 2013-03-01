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

    constructor()
    {
        super(
            "Shotgun",
            10,
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
        this.damgeToWorm = 10;

        this.animationSheetChangeTimer = new Timer(300);

    }


    activate(worm: Worm)
    {
        if (this.getIsActive() == false)
        {
            super.activate(worm);

            this.animationSheetChangeTimer.reset();
            this.fireAnimationIndex = 0;
            AssetManager.getSound("SHOTGUNRELOAD").play(1, 0.3);
        }
    }

    update()
    {
        if (super.update())
        {
            this.animationSheetChangeTimer.update();

            if (this.animationSheetChangeTimer.hasTimePeriodPassed())
            {             
                this.swapSpriteSheet(this.fireAnimations[this.fireAnimationIndex]);
                this.fireAnimationIndex++;
            }


            if (this.fireAnimationIndex >= this.fireAnimations.length)
            {
                var hitPiont = Physics.shotRay(this.worm.body.GetPosition(), this.worm.target.getTargetDirection().Copy());
                if (hitPiont)
                {
                    Effects.explosion(hitPiont,
                        this.damageToTerrainRadius,
                        3,
                        2,
                        this.damgeToWorm,
                        this.worm,
                        AssetManager.getSound("ShotGunFire"));
                }
                this.animationSheetChangeTimer.pause();
                this.fireAnimationIndex = 0;

                setTimeout(function () => {
                    this.setIsActive(false);
                    this.swapSpriteSheet(this.fireAnimations[this.fireAnimationIndex]);
                }, 400);


            }

        }



    }