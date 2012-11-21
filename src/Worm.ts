///<reference path="system/Graphics.ts"/>
///<reference path="system/AssetManager.ts"/>
///<reference path="system/Physics.ts"/>
///<reference path="animation/Sprite.ts"/>
///<reference path="tools/Drill.ts"/>
///<reference path="Team.ts"/>
///<reference path="system/Utilies.ts" />
///<reference path="system/NameGenerator.ts" />


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
    currentState;
    name;
    health;
    team : Team;

    constructor (team, x, y)
    {
        super(Sprites.worms.lookAround);

        this.name = NameGenerator.randomName();
        this.health = 100;
        this.team = team;

        x = Physics.pixelToMeters(x);
        y = Physics.pixelToMeters(y);

        var fixDef = new b2FixtureDef;
        fixDef.density = 0.0;
        fixDef.friction = 1.0;
        fixDef.restitution = 0.0;
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
        this.speed = 0.9;

        this.body.SetUserData("worm");

        this.canJump = false;

        Physics.addContactListener(function (contact) => {

            if(Physics.isObjectColliding(Terrain.userData, this.body.GetUserData(), contact))
            {
                this.canJump = true;
            }

        });

        this.currentWeapon = new Drill();
    }

    fire()
    {
        this.currentWeapon.active(this);
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
                //AssetManager.sounds["JUMP1"].play();

                // this.body.SetFixedRotation(false);
                var currentPos = this.body.GetPosition();
               // this.body.SetPosition(new b2Vec2(currentPos.x, currentPos.y - this.body.GetFixtureList().GetShape().GetRadius()));
                var forces = new b2Vec2(this.direction * 0.1, 2);
                forces.Multiply(10);
                //this.body.SetLinearVelocity(forces);
                var piontOfForce = this.body.GetPosition().Copy();
                piontOfForce.y -= this.body.GetFixtureList().GetShape().GetRadius()*2

                this.body.ApplyImpulse(forces, piontOfForce);
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
        if (this.spriteDef != Sprites.worms.walking)
            super.setSpriteDef(Sprites.worms.lookAround); 
        
        if ( Utilies.isBetweenRange(this.body.GetLinearVelocity().y,1.5,-1.5) )
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
     
        ctx.save()
        if (this.direction == this.DIRECTION.right)
        {
            // Used to flip the sprites       
            ctx.scale(-1, 1);
        }
        

        super.draw(ctx,
            -radius,
            -radius);

         ctx.restore()

          
       // ctx.fillStyle = '#1A1110';
       // ctx.strokeStyle = "#eee";
       // ctx.roundRect(-radius*3, -radius*3, 55, 15, 5).fill();
       //ctx.roundRect(-radius*3, -radius*3, 55, 15, 5).stroke();
       ctx.fillStyle = this.team.color;
       ctx.textAlign = 'center';
       ctx.fillText(this.name, 0, -radius*2.8);
       ctx.fillText(this.health, 0, -radius*1.5);

        ctx.restore()
    }

}