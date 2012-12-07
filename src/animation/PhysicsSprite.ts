/**
 * PhysicsSprite.js
 * This is handies sprite that also need to animate interm of movement and physics
 *
 *  License: Apache 2.0
 *  author:  Ciarán McCann
 *  url: http://www.ciaranmccann.me/
 */
///<reference path="Sprite.ts"/>
///<reference path="SpriteDefinitions.ts"/>
///<reference path="../system/AssetManager.ts"/>
///<reference path="../system/Utilies.ts"/>
///<reference path="../system/Timer.ts" />
///<reference path="../Settings.ts" />
///<reference path="../system/Physics.ts" />

class PhysicsSprite extends Sprite
{
    velocity;
    position;
    acc;

    constructor (initalPos, initalVelocity, spriteDef)
    {
        super(spriteDef);
        this.position = initalPos;
        this.velocity = initalVelocity;
       
    }

    draw(ctx,x = this.position.x, y  = this.position.y)
    {
        super.draw(ctx, x,y);
    }

    update()
    {
        var t = 0.016;
        var g = new b2Vec2(0, 9.81);

        var at = g.Copy();
        this.velocity.Add(at);

        var vt = this.velocity.Copy();
        vt.Multiply(t);
        this.position.Add(vt);

        super.update();
    }



}