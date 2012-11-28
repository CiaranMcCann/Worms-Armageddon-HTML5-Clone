/**
 *  
 * This class manages animation of sprites
 * Its normally a base class for most objects in game like the Worm. 
 *
 *  License: Apache 2.0
 *  author:  Ciarán McCann
 *  url: http://www.ciaranmccann.me/
 */
///<reference path="../Game.ts"/>
///<reference path="../Main.ts"/>
///<reference path="SpriteDefinitions.ts"/>
class Sprite
{

    spriteDef: SpriteDefinition;
    currentFrameY: number;

    finished: bool;
    noLoop: bool;
    lastUpdateTime;
    accumulateDelta;
    isSpriteLocked;
    

    constructor (spriteDef: SpriteDefinition, noLoop = false)
    {
        
        this.spriteDef = spriteDef;
        this.lastUpdateTime = 0;
        this.accumulateDelta = 0;
        this.noLoop = noLoop;
        this.finished = false;
        this.currentFrameY = this.spriteDef.frameY;
        this.isSpriteLocked = false;
    }

    update()
    {
        if (this.finished == false)
        {
            var delta = Date.now() - this.lastUpdateTime;

            if (this.accumulateDelta > this.spriteDef.msPerFrame)
            {
                this.accumulateDelta = 0;
                this.currentFrameY++;

                if (this.currentFrameY >= this.spriteDef.frameCount)
                {
                    // If aniamtion is not meant to loop 
                    if (this.noLoop)
                    {
                        this.finished = true;
                    }

                    this.currentFrameY = this.spriteDef.frameY; //reset to start
                }

            } else
            {
                this.accumulateDelta += delta;
            }

            this.lastUpdateTime = Date.now();

        }
    }

    //Draws this sprite at the center of another
    drawOnCenter(ctx, x, y, spriteToCenterOn: Sprite)
    {
        if (this.finished == false)
        {
            ctx.save();
            ctx.translate(
                (spriteToCenterOn.getImage().width - this.getImage().width) / 2,
                (spriteToCenterOn.getFrameHeight() - this.getFrameHeight()) / 2
            )
            this.draw(ctx, x, y);
            ctx.restore();
        }
    }

    draw(ctx, x, y)
    {
        if (this.finished == false)
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
    }

    getImage()
    {
        return AssetManager.images[this.spriteDef.imageName];
    }

    getCurrentFrame()
    {
        return this.currentFrameY;
    }

    getFrameHeight()
    {
        var img = AssetManager.images[this.spriteDef.imageName];
        var frameHeight = img.height / this.spriteDef.frameCount;

        return frameHeight;
    }

    getTotalFrames()
    {
        return this.spriteDef.frameCount;
    }

    setSpriteDef(spriteDef: SpriteDefinition, lockSprite = false)
    {

        if (spriteDef != this.spriteDef)
        {
            if (this.isSpriteLocked == false)
            {
                this.spriteDef = spriteDef;
                //Logger.debug("SpriteDef " + this.spriteDef.imageName + " LockSprite " + lockSprite);
                this.currentFrameY = this.spriteDef.frameY;
                this.isSpriteLocked = lockSprite;
            }
        }

        if (this.isSpriteLocked == true && this.spriteDef == spriteDef && lockSprite == false)
        {
            this.isSpriteLocked = lockSprite;
        }

    }

}