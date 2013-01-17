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
    worm: Worm;
    direction;

    constructor(worm: Worm)
    {
        super(new b2Vec2(0, 0), Physics.vectorMetersToPixels(worm.body.GetPosition()), Sprites.weapons.redTarget);
        //The direction in which the worm is aiming
        this.targetDirection = new b2Vec2(0, 1);
        this.rotationRate = 4;
        this.worm = worm;
        this.direction = Worm.DIRECTION.left;
    }

    draw(ctx)
    {
        if (this.worm.isActiveWorm() && this.worm.getWeapon().requiresAiming)
        {

            var radius = this.worm.fixture.GetShape().GetRadius() * Physics.worldScale;
            var wormPos = Physics.vectorMetersToPixels(this.worm.body.GetPosition());
            var targetDir = this.targetDirection.Copy();

            targetDir.Multiply(95);
            targetDir.Add(wormPos);

            //ctx.beginPath(); // Start the path
            //ctx.moveTo(wormPos.x, wormPos.y); // Set the path origin
            //ctx.lineTo(targetDir.x, targetDir.y); // Set the path destination
            //ctx.closePath(); // Close the path
            //ctx.stroke();

            super.draw(ctx, targetDir.x - radius, targetDir.y - (radius * 2));
        }
    }

    getTargetDirection()
    {
        return this.targetDirection;
    }

    setTargetDirection(vector)
    {
        this.targetDirection = vector;
    }

    changeDirection(dir)
    {
        var td = this.targetDirection.Copy();

        if (dir == Worm.DIRECTION.left && this.direction != dir)
        {
            this.direction = dir;
            var currentAngle = Utilies.toDegrees(Utilies.toRadians(180) + Utilies.vectorToAngle(td));
            this.targetDirection = Utilies.angleToVector(Utilies.toRadians(currentAngle));

        } else if (dir == Worm.DIRECTION.right && this.direction != dir)
            {

            this.direction = dir;
            var currentAngle = Utilies.toDegrees(Utilies.toRadians(-180) + Utilies.vectorToAngle(td));
            this.targetDirection = Utilies.angleToVector(Utilies.toRadians(currentAngle));
        }
    }

    // Allows the player to increase the aiming angle or decress
    aim(upOrDown: number)
    {
        var td = this.targetDirection.Copy();
        var currentAngle = Utilies.toRadians(this.rotationRate * upOrDown) + Utilies.vectorToAngle(td);
        this.targetDirection = Utilies.angleToVector(currentAngle);
        console.log(currentAngle);

        //if (this.direction == Worm.DIRECTION.right)
        //{

        //    if (currentAngle >= -90 && currentAngle <= 90)
        //    {
        //        this.targetDirection = Utilies.angleToVector(Utilies.toRadians(currentAngle));
        //    }
        //} else
        //{

        //    if (currentAngle-180 >= -90 && currentAngle-180 <= 90)
        //    {
        //        this.targetDirection = Utilies.angleToVector(Utilies.toRadians(currentAngle));
        //    }
        //}

    }

}