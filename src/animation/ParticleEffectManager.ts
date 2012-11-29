/**
 * ParticleEffectManager.js
 * This simply manages an arrray of particle effects, updates and draws them 
 * once the effect it complete it will be removed from the collection
 *
 *  License: Apache 2.0
 *  author:  Ciarán McCann
 *  url: http://www.ciaranmccann.me/
 */
///<reference path="Sprite.ts"/>
///<reference path="SpriteDefinitions.ts"/>
///<reference path="Particle.ts"/>
///<reference path="ParticleEffect.ts"/>
///<reference path="../system/AssetManager.ts"/>
///<reference path="../system/Utilies.ts"/>
///<reference path="../system/Timer.ts" />
///<reference path="../Settings.ts" />

class ParticleEffectManager
{

    particleEffects: ParticleEffect[];

    constructor ()
    {
        this.particleEffects = [];
    }

    add(effect : ParticleEffect)
    {
        this.particleEffects.push(effect);
    }

    draw(ctx)
    {
        for (var pEffect in this.particleEffects)
        {
            this.particleEffects[pEffect].draw(ctx);
        }
    }

    update()
    {
        for (var pEffect in this.particleEffects)
        {
            this.particleEffects[pEffect].update();

            if (this.particleEffects[pEffect].finished == true)
            {
                Utilies.deleteFromCollection(this.particleEffects, pEffect);
            }

        }


    }


}