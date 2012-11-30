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

    //update()
    //{
    //    var t = 0.016;
    //    var g = new b2Vec2(0, 9.81);

    //    var at = g.Copy();
    //    g.Multiply(t);
    //    this.velocity.Add(at);

    //    var vt = this.velocity.Copy();
    //    vt.Multiply(t);
    //    this.position.Add(vt);
    //    //u * t + 0.5 * a * (t * t);

    //    //v += a * t;
    //    // p += v * t;

       

    //    super.update();
    //}


}