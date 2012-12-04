/**
 * Worm.js inherts Sprite.js
 *
 * This contains all the logic for each indvdiual worm entity. 
 * Its physics objects, sprite drawing, movements etc
 *
 *  License: Apache 2.0
 *  author:  Ciarán McCann
 *  url: http://www.ciaranmccann.me/
 */
///<reference path="system/Graphics.ts"/>
///<reference path="system/AssetManager.ts"/>
///<reference path="system/Physics.ts"/>
///<reference path="animation/Sprite.ts"/>
///<reference path="weapons/Drill.ts"/>
///<reference path="Team.ts"/>
///<reference path="system/Utilies.ts" />
///<reference path="system/NameGenerator.ts" />
///<reference path="Terrain.ts" />
///<reference path="Main.ts" />
///<reference path="WormAnimationManger.ts" />
///<reference path="Target.ts" />

class Worm extends Sprite
{
    DIRECTION = {
        left: -1,
        right: 1
    }

    body;
    fixture;
    direction;
    speed;
    canJump: number;
    name;
    health;
    team: Team;
    footSensor;
    stateAnimationMgmt: WormAnimationManger;
    target: Target;
    isReadyToBeDeleted: bool;


    constructor (team, x, y)
    {
        super(Sprites.worms.lookAround);
        this.name = NameGenerator.randomName();
        this.health = 100;
        this.team = team;

        x = Physics.pixelToMeters(x);
        y = Physics.pixelToMeters(y);
        var circleRadius = (AssetManager.images[this.spriteDef.imageName].width / 2) / Physics.worldScale;

        var fixDef = new b2FixtureDef;
        fixDef.density = 1.0;
        fixDef.friction = 1.0;
        fixDef.restitution = 0.1;
        fixDef.shape = new b2CircleShape(circleRadius);
        fixDef.shape.SetLocalPosition(new b2Vec2(0, (circleRadius) * -1));

        var bodyDef = new b2BodyDef;
        bodyDef.type = b2Body.b2_dynamicBody;
        bodyDef.position.x = x;
        bodyDef.position.y = y;

        this.fixture = Physics.world.CreateBody(bodyDef).CreateFixture(fixDef);
        this.body = this.fixture.GetBody();
        this.body.SetFixedRotation(true);
        this.body.SetSleepingAllowed(false);
        this.direction = 1
        this.speed = 1.2;

        // Setup foot sensor
        fixDef.shape = new b2PolygonShape();
        fixDef.shape.SetAsBox(circleRadius / 2, circleRadius / 4);
        fixDef.isSensor = true;
        this.footSensor = this.body.CreateFixture(fixDef);



        this.body.SetUserData(this);
        this.stateAnimationMgmt = new WormAnimationManger(this);

        this.canJump = 0;

        this.target = new Target(this);
        this.isReadyToBeDeleted = false;
    }

    // What happens when a worm collies with another object
    beginContact(contact)
    {
        if (Physics.isCollisionBetweenTypes(Terrain, Worm, contact))
        {
            if (this.footSensor == contact.GetFixtureA() || this.footSensor == contact.GetFixtureB())
            {
                this.canJump++;
            }
        }
    }

    //What happens when a worm is no longer in contact with the object it was in contact with
    endContact(contact)
    {
        if (Physics.isCollisionBetweenTypes(Terrain, Worm, contact))
        {
            if (this.footSensor == contact.GetFixtureA() || this.footSensor == contact.GetFixtureB())
            {
                this.canJump--;
            }
        }
    }

    fire()
    {
        this.team.getWeaponManager().getCurrentWeapon().activate(this);
        AssetManager.sounds["fire"].play();
    }

    walkLeft()
    {
        if (this.team.getWeaponManager().getCurrentWeapon().getIsActive() == false)
        {
            var currentPos = this.body.GetPosition();

            this.direction = this.DIRECTION.left;
            this.stateAnimationMgmt.setState(WormAnimationManger.WORM_STATE.walking);

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

        if (this.team.getWeaponManager().getCurrentWeapon().getIsActive() == false)
        {
            if (this.canJump > 0)
            {
                // this.canJump--;
                //AssetManager.sounds["JUMP1"].play();

                // this.body.SetFixedRotation(false);
                var currentPos = this.body.GetPosition();
                // 

                // var forces = new b2Vec2(this.direction * 2, 2);
                // forces.Multiply(18);
                var forces = new b2Vec2(0, 1);
                forces.Multiply(40);


                //this.body.SetPosition(new b2Vec2(currentPos.x + this.direction*this.body.GetFixtureList().m_next.GetShape().GetRadius()/2, currentPos.y - this.body.GetFixtureList().m_next.GetShape().GetRadius()/2 ));
                //this.body.SetLinearVelocity(forces);

                // window.setTimeout(function() => {
                this.body.ApplyImpulse(forces, this.body.GetPosition());
                // this.body.SetLinearVelocity(forces);
                //      Logger.debug("Jump");
                //},20 );


                //window.setTimeout(function () => {
                //    this.canJump++;
                //}, 2000);


                //window.setTimeout(function () => { this.kTest = true }, 2000);
                //this.body.SetFixedRotation(true);
            }
        }
    }

    hit(damage)
    {
        GameInstance.healthMenu.update(this.team);

        this.health -= damage;

        if (this.health - damage <= 0)
        {
            this.health = 0;
        }
    }

    walkRight()
    {
        if (this.team.getWeaponManager().getCurrentWeapon().getIsActive() == false)
        {
            var currentPos = this.body.GetPosition();
            this.direction = this.DIRECTION.right;
            this.stateAnimationMgmt.setState(WormAnimationManger.WORM_STATE.walking);

            super.update();

            this.body.SetPosition(new b2Vec2(currentPos.x + this.speed / Physics.worldScale, currentPos.y));
        }

    }

    //Is this the current worm of the current player
    isActiveWorm()
    {
        return this.team.getCurrentWorm() == this && GameInstance.getCurrentPlayerObject().getTeam() == this.team;
    }

    // Once the players death animated is finished then we most create
    // a particle explision effect and pay an explosion sound.
    onDeath()
    {     
        var posX = Physics.metersToPixels(this.body.GetPosition().x);
        var posY = Physics.metersToPixels(this.body.GetPosition().y);
        GameInstance.particleEffectMgmt.add(new ParticleEffect(posX, posY));
        AssetManager.sounds["explosion" + Utilies.random(1, 3)].play();

        // Destory some terrain
        GameInstance.terrain.addToDeformBatch(
          posX,
          posY,
        50);

        //flag to let the team know this worm can be deleted
        this.isReadyToBeDeleted = true;
        
    }


    update()
    {
        //Manages the different states of the animation
        this.stateAnimationMgmt.update();

        //updates the current sprite
        super.update();

        // Always reset to idle
        this.stateAnimationMgmt.setState(WormAnimationManger.WORM_STATE.idle);

        this.team.getWeaponManager().getCurrentWeapon().update();
        this.target.update();

    }

    draw(ctx)
    {
        this.team.getWeaponManager().getCurrentWeapon().draw(ctx);

        if (Sprites.worms.weWon != this.spriteDef)
            this.target.draw(ctx);

        ctx.save()

        var radius = this.fixture.GetShape().GetRadius() * Physics.worldScale;

        ctx.translate(
            Physics.metersToPixels(this.body.GetPosition().x),
            Physics.metersToPixels(this.body.GetPosition().y) - radius * 1.1
        )

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
        ctx.fillText(this.name, 0, -radius * 2.8);
        ctx.fillText(Math.floor(this.health), 0, -radius * 1.5);

        ctx.restore()
    }

}