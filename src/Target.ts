/**
 * Target.js
 *
 * The target or cross hairs the player rotates to aim
 *
 *  License: Apache 2.0
 *  author:  Ciarán McCann
 *  url: http://www.ciaranmccann.me/
 */
///<reference path="system/Graphics.ts"/>
///<reference path="system/Utilies.ts"/>
///<reference path="system/AssetManager.ts"/>
///<reference path="system/Physics.ts"/>
///<reference path="Game.ts"/>
///<reference path="Main.ts"/>
///<reference path="animation/Sprite.ts"/>
///<reference path="animation/PhysicsSprite.ts"/>

class Target extends PhysicsSprite
{
    // Aiming
    private targetDirection;
    rotationRate;
    worm : Worm; 

    constructor (worm : Worm)
    {
        super(new b2Vec2(20, 20), Physics.vectorMetersToPixels(worm.body.GetPosition()), Sprites.weapons.redTarget);
        //The direction in which the worm is aiming
        this.targetDirection = new b2Vec2(0.7, 0.7);
        this.rotationRate = 4;
        this.worm = worm;
    }

    draw(ctx)
    {
        
        if (this.worm.isActiveWorm()  && 
            this.worm.team.getWeaponManager().getCurrentWeapon().requiresAiming 
            //this.worm.stateAnimationMgmt.getState() == WormAnimationManger.WORM_STATE.aiming
             )
        {
            var radius = this.worm.fixture.GetShape().GetRadius() * Physics.worldScale;
            var wormPos = Physics.vectorMetersToPixels(this.worm.body.GetPosition());
            var targetDir = this.targetDirection.Copy();
            targetDir.Multiply(95);
            targetDir.Add(wormPos);

            //if (Settings.DEVELOPMENT_MODE)
            //{
            //    ctx.beginPath(); // Start the path
            //    ctx.moveTo(wormPos.x, wormPos.y); // Set the path origin
            //    ctx.lineTo(targetDir.x, targetDir.y); // Set the path destination
            //    ctx.closePath(); // Close the path
            //    ctx.stroke();
            //}

            super.draw(ctx, targetDir.x - radius, targetDir.y - (radius * 2));
        }
    }

    getTargetDirection()
    {
        return this.targetDirection;
    }

    // Allows the player to increase the aiming angle or decress
    aim(upOrDown: number)
    {      
       // Logger.debug(Utilies.toDegrees(Utilies.vectorToAngle(this.targetDirection)));
        var td = this.targetDirection.Copy();
        //td.Add(Physics.vectorMetersToPixels(this.worm.body.GetPosition()));

        var currentAngle = Utilies.toRadians(this.rotationRate * upOrDown) + Utilies.vectorToAngle(td);
        this.targetDirection = Utilies.angleToVector(currentAngle);
 
    }

}