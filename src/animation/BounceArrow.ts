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

class BounceArrow extends PhysicsSprite
{

    constructor (initalPos)
    {
        initalPos.x -= 15;
        initalPos.y -= 100;
        super(initalPos, null, Sprites.weapons.arrow);    
    }

    physics()
    {
      //override the base class
    }
}