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


class Cloud extends PhysicsSprite
{
   
    constructor ()
    {
        var initalPos = new b2Vec2(Utilies.random(0, GameInstance.camera.levelWidth), Utilies.random(GameInstance.terrain.Offset.y-800, GameInstance.terrain.Offset.y-200));
        var initalVelocity = new b2Vec2(Utilies.random(3, 7)*0.4, 0);
        var spriteDef = Utilies.pickRandom([Sprites.particleEffects.cloudl, Sprites.particleEffects.cloudm, Sprites.particleEffects.clouds]);
                
        super(initalPos, initalVelocity, spriteDef);
    }

    physics(){} //just to override the physics from super

    update()
    {
        // Once the sprite animation has reached the end, then change the framIncremter so it goes
        // back down though the sprites again and then back up etc.
        if (this.getCurrentFrame() >= this.getTotalFrames()-1)
        {
            this.setCurrentFrame(this.getTotalFrames()-1);
            this.frameIncremeter *= -1;

        } else if (this.getCurrentFrame() <= 0)
        {
            this.setCurrentFrame(0);
            this.frameIncremeter *= -1;
        }

        super.update(); 

        this.position.x += this.velocity.x

        if (this.position.x > GameInstance.camera.levelWidth)
        {
            this.position.x = 0;
        }
    }

}