interface SpriteDef
{

    imageName: string;
    frameY: number;
    frameHeight: number;
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
            frameHeight: 26,
            frameCount: 16,
            msPerFrame: 100,

        },

        walkingRight: {

            imageName: "whgrlnk",
            frameY: 0,
            frameHeight: 31,
            frameCount: 10,
            msPerFrame: 100,

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
        ctx.drawImage(
               img,
               0, this.currentFrameY * this.spriteDef.frameHeight, img.width, this.spriteDef.frameHeight,
               x,
               y,
              img.width, 
              this.spriteDef.frameHeight
        );
    }

    setSpriteDef(spriteDef: SpriteDef)
    {
        this.spriteDef = spriteDef;
        this.currentFrameY = this.spriteDef.frameY;
    }

}





