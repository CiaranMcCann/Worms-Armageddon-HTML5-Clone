/**
 * ForceIndicator.js
 *
 *  License: Apache 2.0
 *  author:  Ciarán McCann
 *  url: http://www.ciaranmccann.me/
 */
///<reference path="../animation/Sprite.ts"/>

class ForceIndicator
{
    forcePercentage;
    forceRateIncrease;
    forceMax;
    sprite: Sprite;

    constructor(maxForceForWeapon)
    {
        this.forceMax = maxForceForWeapon; // Max force at which worms can throw
        this.forcePercentage = 0;
        this.sprite = new Sprite(Sprites.particleEffects.blob);
    }

    // Some weapons don't require a force build up meter
    isRequired()
    {
        return this.forceMax != 0;
    }

    draw(ctx, wormPos,targetDirection)
    {
        var wormPos = wormPos.Copy();
        var direction = targetDirection.Copy();
        

        //15
        targetDirection.Multiply(5);

        this.sprite.draw(ctx, targetDirection.x, targetDirection.y);

        //for (var i = 0; i < this.forcePercentage; i += 7)
        //{
           
        //}
    }

    charge(rate)
    {
        this.forcePercentage += rate;
        this.sprite.setCurrentFrame(this.sprite.getCurrentFrame() + 0.5);

        if (this.forcePercentage > 100)
        {
            this.forcePercentage = 100;
        }
    }

    setMaxForce(forceScalerMax)
    {
        this.forceMax = forceScalerMax;
    }

    reset()
    {
        this.forcePercentage = 0;
    }

    getForce()
    {
        return (this.forcePercentage/100)*this.forceMax;
    }

}