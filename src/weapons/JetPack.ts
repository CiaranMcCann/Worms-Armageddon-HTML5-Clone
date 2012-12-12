/**
 * JetPack.js
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

class JetPack extends BaseWeapon
{
    thurstScaler: number;

    constructor ()
    {
        super(
           "Jet Pack",
           2,
         Sprites.weaponIcons.jetPack,
         Sprites.worms.takeOutJetPack,
         Sprites.worms.defualtJetPack
       );

        this.thurstScaler = 0.8;
    }


    update()
    {
        if (this.isActive)
        {
            var forceDir = new b2Vec2(0, 0);

            if (keyboard.isKeyDown(Controls.aimUp.keyboard,true))
            {
                forceDir.y = -1;
            }

            if (keyboard.isKeyDown(Controls.walkLeft.keyboard,true))
            {
                forceDir.x = -1;
            }

            if (keyboard.isKeyDown(Controls.walkRight.keyboard,true))
            {
                forceDir.x = 1;
            }
            
            if (forceDir.Length() > 0)
            {
                forceDir.Multiply(this.thurstScaler);
                this.worm.body.ApplyImpulse(forceDir, this.worm.body.GetWorldCenter());
            }
        }
    }

}