/**
 * ThrowableWeapon.js
 * This is a base type of weapon which is thrown like a generade 
 * it lands and generally explodes after a set time. 
 *
 *  License: Apache 2.0
 *  author:  Ciarán McCann
 *  url: http://www.ciaranmccann.me/
 */
///<reference path="../system/Graphics.ts"/>
///<reference path="../system/AssetManager.ts"/>
///<reference path="../system/Physics.ts"/>
///<reference path="../Terrain.ts"/>
///<reference path="BaseWeapon.ts"/>
///<reference path="../Game.ts"/>
///<reference path="../Main.ts"/>
///<reference path="../animation/Sprite.ts"/>
///<reference path="../animation/Effects.ts"/>

class ThrowableWeapon extends BaseWeapon
{

    body;
    fixture;

    detonationTimer: Timer;

    effectedRadius;
    explosiveForce;
    sprite: Sprite;
    explosionRadius: number;
    maxDamage: number;

    // pre-render box around countdown number
    static preRender()
    {
        var healthBoxWidth = 13;
        var healthBoxHeight = 15
        return Graphics.preRenderer.render(function (ctx) =>
        {

            ctx.fillStyle = '#1A1110';
            ctx.strokeStyle = "#eee";

            Graphics.roundRect(ctx, 0, 0, healthBoxWidth, healthBoxHeight, 4).fill();
            Graphics.roundRect(ctx, 0, 0, healthBoxWidth, healthBoxHeight, 4).stroke();


        }, 39, 20);

    }
    static numberBox = ThrowableWeapon.preRender();

    constructor (name, ammo, iconSpriteDef, weaponSpriteDef: SpriteDefinition, takeOutAnimation: SpriteDefinition, takeAimAnimation: SpriteDefinition)
    {
        super(
            name,
            ammo,
          iconSpriteDef,
          takeOutAnimation,
          takeAimAnimation
        );

        this.sprite = new Sprite(weaponSpriteDef);

        // The area in pxiels that get cut out of the terrain
        this.explosionRadius = 40;

        // Force/worm damge radius
        this.effectedRadius = Physics.pixelToMeters(50);

        // force scaler
        this.explosiveForce = 150

        //hit damage at center
        this.maxDamage = 30;

        // Counter till bomb explodes
        this.detonationTimer = new Timer(5000);
        this.timeToLive = 1000;

    }

    deactivate()
    {

        // Logger.debug(this + " was deactivated ");
        this.setIsActive(false);

        // Counter till bomb explodes
        this.timeToLive = 1000;

    }

    setupPhysicsBodies(initalPosition, initalVelocity)
    {
        // Setup of physical body

        var image = this.sprite.getImage();

        var fixDef = new b2FixtureDef;
        fixDef.density = 1.0;
        fixDef.friction = 3.5;
        fixDef.restitution = 0.3;
        fixDef.shape = new b2CircleShape((image.width / 4) / Physics.worldScale);

        var bodyDef = new b2BodyDef;
        bodyDef.type = b2Body.b2_dynamicBody;
        bodyDef.position = initalPosition;

        this.fixture = Physics.world.CreateBody(bodyDef).CreateFixture(fixDef);
        this.body = this.fixture.GetBody();
        this.body.SetLinearVelocity(initalVelocity);

        this.body.SetUserData(this);
    }

    isLive()
    {
        if (this.timeToLive < 0)
        {
            return true;
        }
        else
        {
            return false;
        }
    }


    //Gets the direction of aim from the target and inital velocity
    // The creates the box2d physics body at that pos with that inital v
    setupDirectionAndForce(worm: Worm)
    {
        var initalVelocity = worm.target.getTargetDirection().Copy();

        //if(this.worm.direction 
        initalVelocity.Multiply(1.5);

        var initalPosition = worm.body.GetPosition();
        initalPosition.Add(initalVelocity);

        initalVelocity = worm.target.getTargetDirection().Copy();
        initalVelocity.Multiply(20);

        this.setupPhysicsBodies(initalPosition, initalVelocity);

    }

    playWormVoice()
    {
        Utilies.pickRandomSound(["watchthis", "fire", "grenade", "incoming", "laugh"]).play();
    }

    activate(worm: Worm)
    {
        if (this.ammo > 0 && this.getIsActive() == false)
        {
             this.detonationTimer.reset();
            this.playWormVoice();
            super.activate(worm);
            this.setupDirectionAndForce(worm);
           

        }
    }

    detonate()
    {
        var animation = Effects.explosion(
            this.body.GetPosition(),
            this.explosionRadius,
            this.effectedRadius,
            this.explosiveForce,
            this.maxDamage,
            this.worm
        );

        //Once the weapons explostion animation has finished then we can move to the next players turn
        animation.onAnimationFinish(function () =>
        {
            GameInstance.getCurrentPlayerObject().turnFinished = true;
        });

        this.deactivate();
        //The bomb has exploded so remove it from the world
        Physics.world.DestroyBody(this.body);
    }

    update()
    {
        if (this.getIsActive())
        {

            //Checks if its time for the bomb to explode
            if (this.detonationTimer.hasTimePeriodPassed() && this.timeToLive > 0)
            {
                this.detonate();
            }
            
        }

        this.detonationTimer.update();
    }


    draw(ctx)
    {

        if (this.getIsActive() && this.timeToLive > 0)
        {
            ctx.save()
            var wormPosInPixels = Physics.vectorMetersToPixels(this.body.GetPosition());

            ctx.translate(
                wormPosInPixels.x,
                wormPosInPixels.y
            )

            ctx.save()
            ctx.rotate(this.body.GetAngle())

            var radius = this.fixture.GetShape().GetRadius() * 2 * Physics.worldScale;

            this.sprite.draw(ctx,
           -radius,
           -radius);

            ctx.restore()

            // ctx.fillStyle = 'rgba(0,0,0,255)';
            // ctx.fillRect(radius/2, -radius / 2, 10, 10);

            ctx.drawImage(ThrowableWeapon.numberBox, radius / 2, -radius * 1.5);
            ctx.fillStyle = 'rgba(255,0,0,255)';
            ctx.fillText(Math.floor(this.detonationTimer.getTimeLeftInSec()/10), radius * 0.95, -radius / 1.4);


            ctx.restore()
        }

    }

}
