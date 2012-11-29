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
    targetDirection;
    rotationRate;
    worm : Worm; 

    constructor (worm : Worm)
    {
        super(new b2Vec2(2, 2), Physics.vectorMetersToPixels(worm.body.GetPosition()), Sprites.weapons.redTarget);
        //The direction in which the worm is aiming
        this.targetDirection = new b2Vec2(0.7, 0.7);
        this.rotationRate = 5;
        this.worm = worm;
    }

    draw(ctx)
    {
        var wormPos = Physics.vectorMetersToPixels(this.worm.body.GetPosition());
        var targetDir = this.targetDirection.Copy();
        targetDir.Multiply(10);
        targetDir.Add(wormPos);


        super.draw(ctx, targetDir.x , targetDir.y);
    }


    aim(upOrDown: number)
    {
        var currentAngle = (this.rotationRate * upOrDown) + Utilies.vectorToAngle(this.targetDirection);
        this.targetDirection = Utilies.angleToVector(currentAngle);
    }

}