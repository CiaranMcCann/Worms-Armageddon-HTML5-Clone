///<reference path="../Game.ts"/>
///<reference path="../Main.ts"/>
///<reference path="SpriteDefinitions.ts"/>

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

    getImage()
    {
        return AssetManager.images[this.spriteDef.imageName];
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