/**
 * BounceArrow.js
 *
 *  License: Apache 2.0
 *  author:  Ciarán McCann
 *  url: http://www.ciaranmccann.me/
 */
///<reference path="Sprite.ts"/>
///<reference path="PhysicsSprite.ts"/>
///<reference path="SpriteDefinitions.ts"/>
///<reference path="../system/AssetManager.ts"/>
///<reference path="../system/Utilies.ts"/>
///<reference path="../system/Timer.ts" />
///<reference path="../Settings.ts" />
///<reference path="../system/Physics.ts" />

class BounceArrow extends Sprite
{
    initalPos;

    constructor (initalPos)
    {
        initalPos.x -= 15;
        initalPos.y -= 120;
        this.initalPos = initalPos;
        super(Sprites.weapons.arrow);    
    }

    draw(ctx)
    {
        if (this.finished == false)
        {
            super.draw(ctx, this.initalPos.x, this.initalPos.y);
        }
    }

    physics()
    {
      //override the base class
    }
}