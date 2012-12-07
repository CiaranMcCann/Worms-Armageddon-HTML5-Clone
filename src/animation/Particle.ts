/**
 * Particle.js
 * Flames and shit... 
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

class Particle extends PhysicsSprite
{
   
    constructor (initalPos, initalVelocity, spriteDef = Sprites.particleEffects.flame1)
    {
        super(initalPos, initalVelocity, spriteDef);
        this.setNoLoop(true);
    }

}