/**
 * JetPack.js
 *
 *  License: Apache 2.0
 *  author:  Ciarán McCann
 *  url: http://www.ciaranmccann.me/
 */
///<reference path="../animation/Sprite.ts"/>

class Waves
{
    wave: Sprite;
    wave2: Sprite;

    constructor()
    {
        this.wave = new Sprite(Sprites.particleEffects.wave);

        var wave2 = Sprites.particleEffects.wave;
        wave2.frameY = 2;
        this.wave2 = new Sprite(wave2);
    }

    update()
    {
        this.wave.update();
        this.wave2.update();
    }

    //TODO pre-render waves
    drawBackgroundWaves(ctx, x, y, w)
    {
       y -= 35;
       ctx.fillRect(x,y,w,400);
       var waveY = y - this.wave.getFrameHeight() * 0.5;

        for (var i = 0; i < w; i += this.wave.getFrameWidth())
        {
            this.wave.draw(ctx,i,waveY);
        }
    }

    //TODO pre-render waves, do somthing to optimize them anyway.
    draw(ctx,x,y,w)
    {        
        var waveY = y - this.wave.getFrameHeight() * 0.5;
        for (var i = 0; i < w; i += this.wave.getFrameWidth())
        {
            this.wave2.draw(ctx,i-1,waveY);
        }

        waveY = y + this.wave.getFrameHeight() * 0.5;
        for (var i = 0; i < w; i += this.wave.getFrameWidth())
        {
            this.wave.draw(ctx,i-1,waveY);
        }
    }

}