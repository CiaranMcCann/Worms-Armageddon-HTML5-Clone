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

    constructor ()
    {
        super(
           "Jet Pack",
           2,
         Sprites.weaponIcons.jetPack,
         Sprites.worms.takeOutJetPack,
         Sprites.worms.defualtJetPack
       );

        this.thurstScaler = 0.2;
        this.flame = new Sprite(Sprites.weapons.jetPackFlamesDown);
    }

    draw(ctx)
    {      
        if (this.isActive)
        {
            var pos = Physics.vectorMetersToPixels(this.worm.body.GetPosition());       
            pos.x -= (this.flame.getImage().width / 2) + this.worm.direction * 10;
            pos.y -= 4;
            this.flame.draw(ctx, pos.x, pos.y);
        }
    }

    update()
    {
        if (this.isActive)
        {
            var forceDir = new b2Vec2(0, 0);

            if (keyboard.isKeyDown(Controls.aimUp.keyboard))
            {
                forceDir.y = -1;               
            }

            if (keyboard.isKeyDown(Controls.walkLeft.keyboard))
            {
                forceDir.x = -1.2;
                this.worm.direction = -1;
            }

            if (keyboard.isKeyDown(Controls.walkRight.keyboard))
            {
                forceDir.x = 1.2;
                this.worm.direction = 1;
            }
            
            if (forceDir.Length() > 0)
            {
                forceDir.Multiply(this.thurstScaler);
                this.worm.body.ApplyImpulse(forceDir, this.worm.body.GetWorldCenter());
            }

            this.worm.setSpriteDef(Sprites.worms.defualtJetPack);
            this.worm.finished = true;
            this.flame.update();
        }
    }

}