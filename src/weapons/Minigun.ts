/**
 *  Minigun.js
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

class Minigun extends RayWeapon
{
    fireRate: Timer;

    constructor()
    {
        super(
            "Minigun",
            8,
            Sprites.weaponIcons.minigun,
            Sprites.worms.minigunTakeOut,
            Sprites.worms.minigunAim
       )


        //Amount of the terrain to cut out
        this.damageToTerrainRadius = 30; //px

        //Health removed from worm when shot hits
        this.damgeToWorm = 10;

        this.fireRate = new Timer(300);
    }


    activate(worm: Worm)
    {
        super.activate(worm);
        this.worm.swapSpriteSheet(Sprites.worms.minigunFire);

        setTimeout(function () => {
                this.setIsActive(false);
                this.worm.swapSpriteSheet(this.takeAimAnimations);
        }, 1000);
        AssetManager.getSound("MiniGunFire").play();
    }

    update()
    {

        if (super.update())
        {
            this.fireRate.update();       

            if (this.fireRate.hasTimePeriodPassed())
            {
                
                var hitPiont = Physics.shotRay(this.worm.body.GetPosition(), this.worm.target.getTargetDirection().Copy());
                if (hitPiont)
                {
                    Effects.explosion(hitPiont,
                        this.damageToTerrainRadius,
                        2,
                        2,
                        this.damgeToWorm,
                        this.worm,
                       null);
                }
            }
          

        }

    }

}




