/**
 * Sprite.js
 * This is encpluates the rendering of animated sprites and also 
 * contains all the various sprites which can be applied to a object.
 * 
 * Sprite is a base class for game enities like the Worms. 
 *
 * SpriteDefinitions can be ascced and set from any where like the following
 * mySpriteObj.setSpriteDef(Sprites.worms.walking);
 *
 *  License: Apache 2.0
 *  author:  Ciarán McCann
 *  url: http://www.ciaranmccann.me/
 */
interface SpriteDefinition
{
    imageName: string;
    frameY: number;
    frameCount: number;
    msPerFrame: number;
}

module Sprites
{

    // These are defined frames for said animations
    export var worms = {

        lookAround: {

            imageName: "wselbak",
            frameY: 0,
            frameCount: 12,
            msPerFrame: 200,

        },

        drill: {

            imageName: "wdrill",
            frameY: 0,
            frameCount: 4,
            msPerFrame: 100,

        },

        walking: {

            imageName: "wwalk",
            frameY: 0,
            frameCount: 15,
            msPerFrame: 50,

        },


        blink: {

            imageName: "wblink1u",
            frameY: 0,
            frameCount: 6,
            msPerFrame: 50,

        },

        falling: {

            imageName: "wfall",
            frameY: 0,
            frameCount: 2,
            msPerFrame: 50,

        }
    }
}

// This class manages animation of sprites
// Its normally a base class for most objects in game like the Worm. 
class Sprite
{

    spriteDef: SpriteDefinition;
    currentFrameY: number;

    lastUpdateTime;
    accumulateDelta;
    isSpriteLocked;

    constructor (spriteDef: SpriteDefinition)
    {

        this.spriteDef = spriteDef;
        this.lastUpdateTime = 0;
        this.accumulateDelta = 0;
        this.currentFrameY = this.spriteDef.frameY;
        this.isSpriteLocked = false;
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