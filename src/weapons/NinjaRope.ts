/**
 * NinjaRope.js
 *
 *  License: Apache 2.0
 *  author:  Ciarán McCann
 *  url: http://www.ciaranmccann.me/
 */
///<reference path="../system/Graphics.ts"/>
///<reference path="../system/AssetManager.ts"/>
///<reference path="../system/Physics.ts"/>
///<reference path="../Terrain.ts"/>
///<reference path="BaseWeapon.ts"/>


class NinjaRope extends BaseWeapon
{

    constructor ()
    {
         super(
            "Ninja Rope",
            3,
          Sprites.weaponIcons.ninjaRope,
          Sprites.worms.takeNinjaRope,
          Sprites.worms.aimNinjaRope
        );

    }

    activate(worm : Worm)
    {
        super.activate(worm);
        
    }

    draw(ctx)
    {
        if (this.getIsActive())
        {

            var dir = this.worm.target.getTargetDirection().Copy();
            dir.Multiply(20);
            var contact = Physics.shotRay(this.worm.body.GetPosition(),dir);

            if (contact)
            {

            }
        }
    }

}