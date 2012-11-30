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

class ThrowableWeapon extends BaseWeapon
{

    body;
    fixture;
    detonationCounter;
    effectedRadius;
    explosiveForce;
    sprite: Sprite;
    explosionRadius: number;

    constructor (name, ammo, iconSpriteDef, weaponSpriteDef: SpriteDefinition, takeOutAnimation : SpriteDefinition,takeAimAnimation : SpriteDefinition)
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

        // set default values
        this.reset();

    
    }

    reset()
    {

        Logger.debug(this + " was deactivated ");
        this.setIsActive(false);

        // Counter till bomb explodes
        this.detonationCounter = 6;
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
    setupDirectionAndForce(worm : Worm)
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

    activate(worm : Worm)
    {
       if (this.ammo > 0)
        {
            super.activate(worm);
            this.setupDirectionAndForce(worm);
            
        }
    }

    detonate()
    {
        var posX = Physics.metersToPixels(this.body.GetPosition().x);
        var posY = Physics.metersToPixels(this.body.GetPosition().y);

        GameInstance.terrain.addToDeformBatch(
                  posX,
                  posY,
               this.explosionRadius);

        this.timeToLive = -1;

        Physics.applyForceToNearByObjects(this.body.GetPosition(), this.effectedRadius, this.explosiveForce);
        GameInstance.particleEffectMgmt.add(new ParticleEffect(posX, posY));
        AssetManager.sounds["explosion" + Utilies.random(1, 3)].play();

        //The bomb has exploded so remove it from the world
        this.reset();
        Physics.world.DestroyBody(this.body);
    }

    update()
    {
        if (this.getIsActive())
        {

            // Decrements the timers on the bomb
            if (this.detonationCounter > 0)
            {
                this.detonationCounter -= 1 / 60;
            }

            //Checks if its time for the bomb to explode
            if (this.detonationCounter <= 1 && this.timeToLive > 0)
            {
                this.detonate();
            }
        }
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

            ctx.fillStyle = 'rgba(255,0,0,255)';
            ctx.fillText(Math.floor(this.detonationCounter), radius / 2, 0);

            ctx.restore()
        }

    }

}
