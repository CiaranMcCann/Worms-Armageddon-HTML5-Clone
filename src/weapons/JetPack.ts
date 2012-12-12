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
    bottomflame: Sprite;
    sideflame: Sprite;
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

        this.thurstScaler = 0.15;
        this.forceDir = new b2Vec2(0, 0);
        this.bottomflame = new Sprite(Sprites.weapons.jetPackFlamesDown);
        this.sideflame = new Sprite(Sprites.weapons.jetPackFlamesSide);
    }

    draw(ctx)
    {      
        if (this.isActive)
        {
            if (this.forceDir.y != 0)
            {
                var pos = Physics.vectorMetersToPixels(this.worm.body.GetPosition());
                pos.x -= (this.bottomflame.getImage().width / 2) + this.worm.direction * 10;
                pos.y -= 4;
                this.bottomflame.draw(ctx, pos.x, pos.y);
            }

            if (this.forceDir.x != 0)
            {
                var pos = Physics.vectorMetersToPixels(this.worm.body.GetPosition());
                //pos.x -= (this.bottomflame.getImage().width / 2);
                pos.x -= this.worm.direction * 13;
                pos.y -= 15;

                ctx.save()
                ctx.translate(pos.x, pos.y);
                if (this.worm.direction == this.worm.DIRECTION.right)
                {
                    // Used to flip the sprites       
                    ctx.scale(-1, 1);
                }
                this.sideflame.draw(ctx, 0,0);
                ctx.restore();
            }
        }
    }

    update()
    {
        if (this.isActive)
        {
            this.forceDir = new b2Vec2(0, 0);

            if (keyboard.isKeyDown(Controls.aimUp.keyboard))
            {
                this.forceDir.y = -1;               
            }

            if (keyboard.isKeyDown(Controls.walkLeft.keyboard))
            {
                this.forceDir.x = -1.2;
                this.worm.direction = -1;
            }

            if (keyboard.isKeyDown(Controls.walkRight.keyboard))
            {
                this.forceDir.x = 1.2;
                this.worm.direction = 1;
            }
            
            if (this.forceDir.Length() > 0)
            {
                Utilies.pickRandomSound(["JetPackLoop1", "JetPackLoop2"]).play();
                this.forceDir.Multiply(this.thurstScaler);
                this.worm.body.ApplyImpulse(this.forceDir, this.worm.body.GetWorldCenter());
            }

            this.worm.setSpriteDef(Sprites.worms.defualtJetPack);
            this.worm.finished = true;

            if (this.forceDir.y != 0)
            this.bottomflame.update();

            if (this.forceDir.x != 0)
            this.sideflame.update();
        }
    }

}