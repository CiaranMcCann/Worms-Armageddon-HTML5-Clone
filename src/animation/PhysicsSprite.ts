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

    constructor (initalPos, initalVelocity, spriteDef)
    {
        super(spriteDef);
        this.position = initalPos;
        this.velocity = initalVelocity;
    }

    draw(ctx)
    {
        super.draw(ctx, this.position.x, this.position.y);
    }

    //update(time = 0.16)
    //{
    //    //u * t + 0.5 * a * (t * t);

    //    //v += a * t;
    //    // p += v * t;

    //    super.update();
    //}


}