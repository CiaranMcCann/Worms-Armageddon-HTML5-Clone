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
    flame: Sprite;
    forceDir;

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
        this.forceDir = new b2Vec2(0, 0);
        this.flame = new Sprite(Sprites.weapons.jetPackFlamesDown);
    }

    draw(ctx)
    {      
        //if (this.forceDir.Length() > 0)
        if (this.isActive)
        {
            var pos = this.worm.body.GetFixtureList().GetBody().GetPosition();
            pos = Physics.vectorMetersToPixels(pos);

            this.flame.draw(ctx, pos.x, pos.y);
        }
    }

    update()
    {
        if (this.isActive)
        {
            this.forceDir = new b2Vec2(0, 0);

            if (keyboard.isKeyDown(Controls.aimUp.keyboard,true))
            {
                this.forceDir.y = -1;               
            }

            if (keyboard.isKeyDown(Controls.walkLeft.keyboard,true))
            {
                this.forceDir.x = -1;
                this.worm.direction = -1;
            }

            if (keyboard.isKeyDown(Controls.walkRight.keyboard,true))
            {
                this.forceDir.x = 1;
                this.worm.direction = 1;
            }
            
            if (this.forceDir.Length() > 0)
            {
                this.forceDir.Multiply(this.thurstScaler);
                this.worm.body.ApplyImpulse(this.forceDir, this.worm.body.GetWorldCenter());
            }

            this.worm.setSpriteDef(Sprites.worms.defualtJetPack);
            this.worm.finished = true;
            this.flame.update();
        }
    }

}