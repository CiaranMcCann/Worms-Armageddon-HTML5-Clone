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
    onFinishFunc;
    

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

                        if (this.onFinishFunc != null)
                        {
                            this.onFinishFunc();
                            this.onFinishFunc = null;
                        }
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
        //if (this.finished == false)
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

    setNoLoop(val: bool)
    {
        this.noLoop = val;
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

    // Allows for func to be called once this sprite animation has finished
    onFinish(func)
    {
        this.onFinishFunc = func;
    }

    setSpriteDef(spriteDef: SpriteDefinition, lockSprite = false, noLoop = false)
    {
        this.noLoop = noLoop;
        this.finished = false;
        if (spriteDef != this.spriteDef)
        {
            if (this.isSpriteLocked == false)
            {
                this.spriteDef = spriteDef;
                this.currentFrameY = this.spriteDef.frameY;
                this.isSpriteLocked = lockSprite;
            }
        }


        //This allows a call to this method to lock the current spriteDef
        // Which stops other calls to this method from unlocking changing the spriteDef
        // unless they pass in the same spritedef that was used when it was inital set.
        // This is useful to stop the game loop and other states from unsetting each others spritedefs
        // Mainly used in the weapon classes.
        if (this.spriteDef == spriteDef)
        {
            this.isSpriteLocked = lockSprite;
        }

    }

}