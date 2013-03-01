/**
 * RayBased Weapons.js
 *
 *  License: Apache 2.0
 *  author:  Ciarán McCann
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

class RayWeapon extends BaseWeapon
{
    damageToTerrainRadius: number;
    damgeToWorm: number;

    constructor(name, ammo, iconSpriteDef, takeOutAnimation: SpriteDefinition, takeAimAnimation: SpriteDefinition)
    {
        super(
            name,
            ammo,
          iconSpriteDef,
          takeOutAnimation,
          takeAimAnimation
        );

        //Amount of the terrain to cut out
        this.damageToTerrainRadius = 30; //px

        //Health removed from worm when shot hits
        this.damgeToWorm = 10;
    }

    update()
    {
        super.update();
        return (this.ammo != 0) && this.getIsActive();
    }

    //Changes sprite sheet but stops the currentframe from resetting
    swapSpriteSheet(spriteSheet: SpriteDefinition)
    {
        var currentFrame = this.worm.getCurrentFrame();
        this.worm.setSpriteDef(spriteSheet);
        this.worm.setCurrentFrame(currentFrame);
        this.worm.finished = true; //So the sprite doesn't animate
    }

}
