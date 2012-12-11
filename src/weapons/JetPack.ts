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

        this.thurstScaler = 100;
    }

    onKeyDown(key)
    {
        if (this.isActive)
        {
            var forceDir = new b2Vec2(0, 0);

            if (key == Controls.aimUp.keyboard)
            {
                forceDir.y = 1;
            }

            if (key == Controls.walkLeft.keyboard)
            {
                forceDir.x = -1;
            }

            if (key == Controls.walkRight.keyboard)
            {
                forceDir.x = 1;
            }
            
            forceDir.Multiply(this.thurstScaler);
            this.worm.footSensor.GetBody().ApplyImpulse(forceDir, this.worm.body.GetPosition());
        }
    }

}