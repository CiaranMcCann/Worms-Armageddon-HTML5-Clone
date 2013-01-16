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
    needReRender: bool;
    renderCanvas;

    constructor(maxForceForWeapon)
    {
        this.forceMax = maxForceForWeapon; // Max force at which worms can throw
        this.forcePercentage = 0;
        this.sprite = new Sprite(Sprites.particleEffects.blob);
        this.needReRender = true;
        this.renderCanvas = null;
    }

    // Some weapons don't require a force build up meter
    isRequired()
    {
        return this.forceMax != 0;
    }


    draw(ctx, worm: Worm)
    {

        if (this.needReRender)
        {
            this.renderCanvas = Graphics.preRenderer.render(function (context) =>
            {
                if(this.renderCanvas == null)
                context.fillRect(0, 0, 400, 400);

                this.sprite.draw(context,0,(this.forcePercentage / 100)*100);
                this.needReRender = false;

            }, this.sprite.getFrameWidth(), 200, this.renderCanvas);
        }


        var radius = worm.fixture.GetShape().GetRadius() * Physics.worldScale;
        var wormPos = Physics.vectorMetersToPixels(worm.body.GetPosition().Copy());
        var targetDir = worm.target.getTargetDirection().Copy();

        //targetDir.Multiply(10);
        targetDir.Add(wormPos);

        ctx.save();

        ctx.translate(
            targetDir.x,
            targetDir.y
        )

        ctx.rotate( Utilies.vectorToAngle(worm.target.getTargetDirection().Copy()) );

        ctx.drawImage(this.renderCanvas, 0,0, this.renderCanvas.width,this.renderCanvas.height);
        ctx.restore();
    }

    charge(rate, worm)
    {
        this.forcePercentage += rate;
        this.sprite.setCurrentFrame(this.sprite.getCurrentFrame() + 0.4);
        this.needReRender = true;

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
       // this.renderCanvas = null;
    }

    getForce()
    {
        return (this.forcePercentage / 100) * this.forceMax;
    }

}