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

    spriteDef;
    currentFrameY: number;

    finished: bool;
    noLoop: bool;
    lastUpdateTime;
    accumulateDelta;
    isSpriteLocked;
    onFinishFunc;
    frameHeight;
    image;
    

    constructor (spriteDef: SpriteDefinition, noLoop = false)
    {
        
        this.lastUpdateTime = 0;
        this.accumulateDelta = 0;
        this.isSpriteLocked = false;
        this.setSpriteDef(spriteDef);
         this.noLoop = noLoop;

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

                this.checkForAttachedSound();

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
         
            ctx.drawImage(
                   this.image,
                   0, this.currentFrameY * this.frameHeight, this.image.width, this.frameHeight,
                   Math.round(x),
                   Math.round(y),
                  this.image.width,
                  this.frameHeight
            );
        }
    }

    getImage()
    {
        return this.image;
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
        return this.frameHeight;
    }

    getTotalFrames()
    {
        return this.spriteDef.frameCount;
    }

    checkForAttachedSound()
    {
        if (this.spriteDef.sound && this.currentFrameY > this.spriteDef.sound.time)
        {
            AssetManager.sounds[this.spriteDef.sound.name].play();
            this.spriteDef.sound.time = Infinity;
        }
    }

    // Allows for func to be called once this sprite animation has finished
    onAnimationFinish(func)
    {
        this.onFinishFunc = func;
    }

    setSpriteDef(spriteDef: SpriteDefinition, lockSprite = false, noLoop = false)
    {

        if (spriteDef != this.spriteDef)
        {
            if (this.isSpriteLocked == false)
            {
                this.noLoop = noLoop;
                this.finished = false;
                this.spriteDef = spriteDef;
                this.currentFrameY = spriteDef.frameY;
                this.isSpriteLocked = lockSprite;

                this.image = AssetManager.images[spriteDef.imageName];
                this.frameHeight = this.image.height / spriteDef.frameCount;
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