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
    }


    activate(worm: Worm)
    {
        super.activate(worm);
        this.swapSpriteSheet(Sprites.worms.minigunFire);

    }

}




