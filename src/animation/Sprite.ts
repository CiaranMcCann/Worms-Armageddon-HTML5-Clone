interface SpriteDef
{

    imageName: string;
    frameY: number;
    frameCount: number;
    msPerFrame: number;

}

module Sprites
{

    var spriteDirectory = "data/img/worms/";

    // These are defined frames for said animations
    export var worms = {

        lookAround: {

            imageName: "wselect",
            frameY: 0,
            frameCount: 16,
            msPerFrame: 100,

        },

        walkingLeft: {

            imageName: "wwalk",
            frameY: 0,
            frameCount: 15,
            msPerFrame: 50,

        },

        walkingRight: {

            imageName: "wwalkright",
            frameY: 0,
            frameCount: 15,
            msPerFrame: 50,

        }


    }

}

// This class manages animation of sprites
// Its normally a base class for most objects in game like the Worm. 
class Sprite
{

    spriteDef: SpriteDef;
    currentFrameY: number;

    lastUpdateTime;
    accumulateDelta;

    constructor (spriteDef: SpriteDef)
    {

        this.spriteDef = spriteDef;
        this.lastUpdateTime = 0;
        this.accumulateDelta = 0;
        this.currentFrameY = this.spriteDef.frameY;
    }

    update()
    {

        var delta = Date.now() - this.lastUpdateTime;

        if (this.accumulateDelta > this.spriteDef.msPerFrame)
        {
            this.accumulateDelta = 0;
            this.currentFrameY++;

            if (this.currentFrameY >= this.spriteDef.frameCount)
            {
                this.currentFrameY = this.spriteDef.frameY; //reset to start
            }

        } else
        {
            this.accumulateDelta += delta;
        }

        this.lastUpdateTime = Date.now();

    }

    draw(ctx, x, y)
    {
        var img = AssetManager.images[this.spriteDef.imageName];
        var frameHeight = img.height / this.spriteDef.frameCount;

        ctx.drawImage(
               img,
               0, this.currentFrameY * frameHeight, img.width, frameHeight,
               x,
               y,
              img.width, 
              frameHeight
        );
    }

    sync()
    {
        return this.accumulateDelta > this.spriteDef.msPerFrame;
    }

    getCurrentFrame()
    {
        return this.currentFrameY;
    }

    getTotalFrames()
    {
        return this.spriteDef.frameCount;
    }

    setSpriteDef(spriteDef: SpriteDef)
    {
        if (spriteDef != this.spriteDef)
        {
            this.spriteDef = spriteDef;
            this.currentFrameY = this.spriteDef.frameY;
        }
    }

}





