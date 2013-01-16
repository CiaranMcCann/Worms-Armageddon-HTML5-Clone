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
        wave2.frameY = 1;
        this.wave2 = new Sprite(wave2);
    }

    update()
    {
        this.wave.update();
        this.wave2.update();
    }

    drawBackgroundWaves(ctx, x, y, w)
    {
        ctx.fillStyle = "#384084";
        ctx.fillRect(x,y,w,400);

       var waveY = y - this.wave.getFrameHeight() * 0.5;

        for (var i = 0; i < w; i += this.wave.getFrameWidth())
        {
            this.wave.draw(ctx,i,waveY);
        }
    }

    draw(ctx,x,y,w)
    {

        //ctx.fillStyle = "#384084";
        //ctx.fillRect(x,y,w,this.wave.getFrameHeight()*3);

        var waveY = y - this.wave.getFrameHeight() * 0.5;

        for (var i = 0; i < w; i += this.wave.getFrameWidth())
        {
            this.wave2.draw(ctx,i,waveY);
        }

        waveY = y + this.wave.getFrameHeight() * 0.5;

        for (var i = 0; i < w; i += this.wave.getFrameWidth())
        {
            this.wave.draw(ctx,i,waveY);
        }
    }

}