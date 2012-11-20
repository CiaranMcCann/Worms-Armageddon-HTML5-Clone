///<reference path="system/Graphics.ts"/>
///<reference path="system/AssetManager.ts"/>
///<reference path="system/Physics.ts"/>
///<reference path="animation/Sprite.ts"/>
///<reference path="tools/Drill.ts"/>


class Worm extends Sprite
{
    DIRECTION = {
        left: -1,
        right: 1
    }

    STATE = {
        FALLING: 0,
        IDEL: 1,
        WALKING: 2,
        USING_TOOL: 3,
    }

    body;
    fixture;
    image;
    direction;
    sprite;
    speed;
    canJump;
    currentWeapon;

    constructor (x, y)
    {
        super(Sprites.worms.lookAround);

        var fixDef = new b2FixtureDef;
        fixDef.density = 1.0;
        fixDef.friction = 1.0;
        fixDef.restitution = 0.1;
        fixDef.shape = new b2PolygonShape();
        fixDef.shape = new b2CircleShape((AssetManager.images[this.spriteDef.imageName].width / 2) / Physics.worldScale);

        var bodyDef = new b2BodyDef;
        bodyDef.type = b2Body.b2_dynamicBody;
        bodyDef.position.x = x;
        bodyDef.position.y = y;

        this.fixture = Physics.world.CreateBody(bodyDef).CreateFixture(fixDef);
        this.body = this.fixture.GetBody();
        this.body.SetFixedRotation(true);
        this.body.SetSleepingAllowed(false);
        this.direction = 1
        this.speed = 0.5;

        this.body.SetUserData("worm");

        this.canJump = false;

        Physics.addContactListener(function (contact) => {

            if(Physics.isObjectColliding(Terrain.userData, this.body.GetUserData(), contact))
            {
                this.canJump = true;
            }

        });

        this.currentWeapon = new Drill(this);
    }

    fire()
    {
        this.currentWeapon.active();
    }

    walkLeft()
    {
        if (this.currentWeapon.isActive == false)
        {
            var currentPos = this.body.GetPosition();

            this.direction = this.DIRECTION.left;
            if (Sprites.worms.falling != this.spriteDef)
            {
                super.setSpriteDef(Sprites.worms.walking);
            }

            super.update();
            this.body.SetPosition(new b2Vec2(currentPos.x - this.speed / Physics.worldScale, currentPos.y));
            //this.body.SetLinearVelocity(new b2Vec2(-5,0));


            if (AssetManager.sounds["WalkExpand"].isPlaying() == false)
            {
                if (super.getCurrentFrame() % 5 == 0)
                {
                    AssetManager.sounds["WalkCompress"].play();
                } else
                {
                    AssetManager.sounds["WalkExpand"].play();
                }
            }
        }

    }

    jump()
    {
        if (this.currentWeapon.isActive == false)
        {
            if (this.canJump)
            {
                // this.body.SetFixedRotation(false);
                var currentPos = this.body.GetPosition();
                //this.body.SetPosition(new b2Vec2(currentPos.x, currentPos.y - this.body.GetFixtureList().GetShape().GetRadius()));
                var forces = new b2Vec2(this.direction * 1, 2);
                forces.Multiply(10);
                //this.body.SetLinearVelocity(forces);
                this.body.ApplyImpulse(forces, this.body.GetPosition());
                Logger.debug("Jump");
                //this.body.SetFixedRotation(true);
            }
        }
    }

    walkRight()
    {
        if (this.currentWeapon.isActive == false)
        {
            var currentPos = this.body.GetPosition();
            this.direction = this.DIRECTION.right;

            if (Sprites.worms.falling != this.spriteDef)
            {
                super.setSpriteDef(Sprites.worms.walking);
            }

            super.update();

            this.body.SetPosition(new b2Vec2(currentPos.x + this.speed / Physics.worldScale, currentPos.y));
            //var forces = new b2Vec2(5, 0);
            //this.body.SetLinearVelocity(forces);
        }
        
    }

    update()
    {
        super.setSpriteDef(Sprites.worms.lookAround);    
        
        if ( Utilies.isBetweenRange(this.body.GetLinearVelocity().y,0.5,-0.5) )
        {
            this.canJump = true;         
        }
        else
        {
            this.canJump = false;
            super.setSpriteDef(Sprites.worms.falling);           
        }

        
         this.currentWeapon.update();

         if (this.spriteDef != Sprites.worms.walking)
         {
             super.update();
         }
          
      
    }

    draw(ctx)
    {

        ctx.save()

        ctx.translate(
        this.body.GetPosition().x * Physics.worldScale,
        this.body.GetPosition().y * Physics.worldScale
        )

        //ctx.rotate(this.body.GetAngle())
        var radius = this.fixture.GetShape().GetRadius() * Physics.worldScale;
     
        if (this.direction == this.DIRECTION.right)
        {
            // Used to flip the sprites
            ctx.scale(-1, 1);
        }
        

        super.draw(ctx,
            -radius,
            -radius);

        ctx.restore()

    }

}