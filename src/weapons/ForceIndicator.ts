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
    private forcePercentage;
    private forceRateIncrease;
    private forceMax;
    private  sprite: Sprite;
    private  needReRender: bool;
    private  renderCanvas;

    constructor(maxForceForWeapon)
    {
        this.forceMax = maxForceForWeapon; // Max force at which worms can throw
        this.forcePercentage = 1;
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
        if (this.isCharging() && this.isRequired())
        {

            if (this.needReRender)
            {
                this.renderCanvas = Graphics.preRenderer.render(function (context) =>
                {
                    // if(this.renderCanvas == null)
                     //context.fillRect(0, 0, 400, 400);

                    this.sprite.draw(context, 0, (this.forcePercentage / 100) * 100);
                    this.needReRender = false;

                }, this.sprite.getFrameWidth(), 200, this.renderCanvas);
            }


            var radius = worm.fixture.GetShape().GetRadius() * Physics.worldScale;
            var wormPos = Physics.vectorMetersToPixels(worm.body.GetPosition().Copy());
            var targetDir = worm.target.getTargetDirection().Copy();
            targetDir.Multiply(16);
            targetDir.Add(wormPos);

            ctx.save();

            ctx.translate(
                targetDir.x,
                targetDir.y
            )

             
            //TODO - Why do I put -90 in here? Is it that my target is wrong? Is it somthing to do with canvas corrdianate system. Hmm ask Ken.
            //TODO No is cause of the canvas corrdinate system, oh yea.
            ctx.rotate(Utilies.vectorToAngle(worm.target.getTargetDirection().Copy()) + Utilies.toRadians(-90));

            ctx.drawImage(this.renderCanvas, -radius,  -radius, this.renderCanvas.width, this.renderCanvas.height);
            ctx.restore();
        }
    }

    charge(rate)
    {
        if (this.isRequired())
        {
            AssetManager.getSound("THROWPOWERUP").play();
            this.forcePercentage += rate;
            this.sprite.setCurrentFrame(this.sprite.getCurrentFrame() + 0.4);
            this.needReRender = true;

            if (this.forcePercentage > 100)
            {
                this.forcePercentage = 100;
                return true;
            }
        }
    }

    isCharging()
    {
        return this.forcePercentage > 1;
    }

    setMaxForce(forceScalerMax)
    {
        this.forceMax = forceScalerMax;
    }

    reset()
    {
        if (this.isRequired() && this.forcePercentage > 1)
        {
            this.forcePercentage = 1;
            AssetManager.getSound("THROWPOWERUP").pause();
            AssetManager.getSound("THROWRELEASE").play();
            this.renderCanvas.getContext('2d').clearRect(0, 0, this.renderCanvas.width, this.renderCanvas.height);

            //Used to reset the sprite
            this.sprite.currentFrameY = 0;
        }
    }

    getForce()
    {
        return (this.forcePercentage / 100) * this.forceMax;
    }

}