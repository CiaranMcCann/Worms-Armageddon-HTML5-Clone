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

    finished: boolean;
	noLoop: boolean;
    lastUpdateTime;
    accumulateDelta;
    isSpriteLocked;
    onFinishFunc;
    frameHeight;
    image;

    frameIncremeter;
    

    constructor (spriteDef: SpriteDefinition, noLoop = false)
    {
        //Defualts to moving forward though the sprite
        //though can be used to move back though the sprite
        this.frameIncremeter = 1;
        
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
                this.currentFrameY += this.frameIncremeter;

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
                            return
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
        var tmpCurrentFrameY = Math.floor(this.currentFrameY);
        if(tmpCurrentFrameY >= 0)
        {       
            ctx.drawImage(
                   this.image,
                   0, tmpCurrentFrameY * this.frameHeight, this.image.width, this.frameHeight,
                   Math.floor(x),
                   Math.floor(y),
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

    setCurrentFrame(frame)
    {
        if (frame >= 0 && frame < this.spriteDef.frameCount)
        {
             this.currentFrameY = frame;
        }

    }

    setNoLoop(val: boolean)
    {
        this.noLoop = val;
    }

    getFrameHeight()
    {       
        return this.frameHeight;
    }

    getFrameWidth()
    {       
       return this.image.width;
    }

    getTotalFrames()
    {
        return this.spriteDef.frameCount;
    }


    // Allows for func to be called once this sprite animation has finished
    onAnimationFinish(func)
    {
        if(this.isSpriteLocked == false)
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

                this.image = AssetManager.getImage(spriteDef.imageName);
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

    //Changes sprite sheet but stops the currentframe from resetting
    swapSpriteSheet(spriteSheet: SpriteDefinition)
    {
        var currentFrame = this.getCurrentFrame();
        this.setSpriteDef(spriteSheet);
        this.setCurrentFrame(currentFrame);
        this.finished = true; //So the sprite doesn't animate
    }

}