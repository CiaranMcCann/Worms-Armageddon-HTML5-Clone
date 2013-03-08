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
///<reference path="animation/HealthReduction.ts"/>
///<reference path="weapons/Drill.ts"/>
///<reference path="Team.ts"/>
///<reference path="system/Utilies.ts" />
///<reference path="system/NameGenerator.ts" />
///<reference path="environment/Terrain.ts" />
///<reference path="Main.ts" />
///<reference path="WormAnimationManger.ts" />
///<reference path="Target.ts" />

class Worm extends Sprite
{
    static DIRECTION = {
        left: -1,
        right: 1
    }

    body;
    fixture;
    direction;
    speed;
    canJump: number;
    name;

    damageTake;
    health;

    //Pre-render shapes for text
    nameBox;
    healthBox;

    //Bouncying arrow when selected
    arrow: BounceArrow;

    team: Team;
    footSensor;
    stateAnimationMgmt: WormAnimationManger;
    target: Target;
    isDead: bool;

    soundDelayTimer: Timer;

    //Acumlated force at which worm hits ground
    //force: number;
    fallHeight: number;

    constructor(team, x, y)
    {
        super(Sprites.worms.idle1);
        this.name = NameGenerator.randomName();
        this.health = 50;
        this.damageTake = 0;
        this.team = team;

        x = Physics.pixelToMeters(x);
        y = Physics.pixelToMeters(y);
        var circleRadius = (AssetManager.getImage(this.spriteDef.imageName).width / 2) / Physics.worldScale;

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
        this.isDead = false;

        this.soundDelayTimer = new Timer(200);

        this.preRendering();

        this.fallHeight = this.body.GetPosition().y;
        Physics.addToFastAcessList(this.body);
    }

    getWormNetData()
    {
        return { "x": this.body.GetPosition().x, "y": this.body.GetPosition().y, "arrow": this.arrow };
    }

    setWormNetData(packetStream)
    {
        Logger.log(" old pos " + this.body.m_xf.position.x + " new pos " + packetStream.x);

        this.body.SetPosition(new b2Vec2(packetStream.x, packetStream.y));
    }

    // Pre-renders the boxes above their heads with name and health
    preRendering()
    {
        var nameBoxWidth = this.name.length * 10;
        var healthBoxWidth = 39;
        var healthBoxHeight = 18
        this.nameBox = Graphics.preRenderer.render(function (ctx) =>
        {

            ctx.fillStyle = '#1A1110';
            ctx.strokeStyle = "#eee";
            ctx.font = 'bold 16.5px Sans-Serif';
            ctx.textAlign = 'center';

            Graphics.roundRect(ctx, 0, 0, nameBoxWidth, 20, 4).fill();
            Graphics.roundRect(ctx, 0, 0, nameBoxWidth, 20, 4).stroke();

            ctx.fillStyle = this.team.color;
            ctx.fillText(this.name, (this.name.length * 10) / 2, 15);

        }, nameBoxWidth, 20);

        this.healthBox = Graphics.preRenderer.render(function (ctx) =>
        {

            ctx.fillStyle = '#1A1110';
            ctx.strokeStyle = "#eee";
            ctx.font = 'bold 16.5px Sans-Serif';
            ctx.textAlign = 'center';

            Graphics.roundRect(ctx, 0, 0, healthBoxWidth, healthBoxHeight, 4).fill();
            Graphics.roundRect(ctx, 0, 0, healthBoxWidth, healthBoxHeight, 4).stroke();

            ctx.fillStyle = this.team.color;
            ctx.fillText(Math.floor(this.health), healthBoxWidth / 2, healthBoxHeight - 3);

        }, 39, 20);


    }

    getHealth() { return this.health; }

    setHealth(health: number)
    {
        if (health > 0)
        {
            this.health = health;

        } else
        {
            this.health = 0;
        }

        //Update worm heading with the health
        this.preRendering();
    }

    getWeapon()
    {
        return this.team.getWeaponManager().getCurrentWeapon();
    }


    // What happens when a worm collies with another object
    beginContact(contact)
    {
        if (Physics.isCollisionBetweenTypes(Terrain, Worm, contact))
        {
            if (this.footSensor == contact.GetFixtureA() || this.footSensor == contact.GetFixtureB())
            {
                this.canJump++;

                //If backflip animation playing then disable it
                //when the worm colides with somthing.
                if (this.spriteDef == Sprites.worms.wbackflp)
                {
                    this.setSpriteDef(Sprites.worms.wbackflp, false);
                    this.setSpriteDef(Sprites.worms.idle1, false);
                }
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

    postSolve(contact, impulse)
    {
        var impactTheroshold = 8

        // If the worm is using the Jetpack don't take damage
        if ((this.getWeapon() instanceof JetPack) && this.getWeapon().getIsActive())
        {
            impactTheroshold = 10
        }
        //If the worm is using the NijaRope don't take damage
        if ((this.getWeapon() instanceof NinjaRope) == false || this.getWeapon().getIsActive() == false)
        {
            if (impulse.normalImpulses[0] > impactTheroshold)
            {
                var damage = Math.round(impulse.normalImpulses[0]) / 2;

                if (damage > 10)
                {
                    damage = 10;
                }


                this.hit(damage);

                if () //online spefic, returns true all the time if in local games
                {                 
                    Client.sendImmediately(Events.client.ACTION, new InstructionChain("wormManager.damageWormWithName", parameters));
                }

            }

            if (impulse.normalImpulses[0] > 3)
            {
                AssetManager.getSound("WormLanding").play();
            }
        }



    }

    isStationary()
    {
        var isStationary = this.body.GetLinearVelocity().Length() == 0 // Completely stopped
        || // OR 
        Utilies.isBetweenRange(this.body.GetLinearVelocity().y, 0.001, -0.001) && Utilies.isBetweenRange(this.body.GetLinearVelocity().x, 0.001, -0.001); // near enough stopped

        return isStationary;
    }

    fire()
    {
        if (GameInstance.state.hasNextTurnBeenTiggered() == false)
        {
            var weapon = this.team.getWeaponManager().getCurrentWeapon();
            weapon.activate(this);

            //Once the player fires removed bouncing arrow
            if (this.arrow)
            {
                this.arrow.finished = true;
            }

            weapon.getForceIndicator().reset();
        }
    }

    playWalkingSound()
    {
        if (this.soundDelayTimer.hasTimePeriodPassed())
        {
            if (this.spriteDef == Sprites.worms.walking)
            {
                if (super.getCurrentFrame() % 5 == 0)
                {
                    AssetManager.getSound("WalkCompress").play(0.5);
                } else
                {
                    AssetManager.getSound("WalkExpand").play(0.5);
                }
            }
        }
    }

    walkLeft()
    {
        if (WormAnimationManger.playerAttentionSemaphore == 0)
        {
            var currentPos = this.body.GetPosition();

            this.direction = Worm.DIRECTION.left;
            this.target.changeDirection(Worm.DIRECTION.left);

            this.stateAnimationMgmt.setState(WormAnimationManger.WORM_STATE.walking);

            super.update();
            this.body.SetPosition(new b2Vec2(currentPos.x - this.speed / Physics.worldScale, currentPos.y));

            this.playWalkingSound();
        }

        //Once the player moves removed bouncing arrow
        if (this.arrow)
        {
            this.arrow.finished = true;
        }

    }

    walkRight()
    {
        if (WormAnimationManger.playerAttentionSemaphore == 0)
        {
            var currentPos = this.body.GetPosition();
            this.direction = Worm.DIRECTION.right;
            this.target.changeDirection(Worm.DIRECTION.right);
            this.stateAnimationMgmt.setState(WormAnimationManger.WORM_STATE.walking);

            super.update();
            this.body.SetPosition(new b2Vec2(currentPos.x + this.speed / Physics.worldScale, currentPos.y));

            this.playWalkingSound();

            //Once the player moves removed bouncing arrow
            if (this.arrow)
            {
                this.arrow.finished = true;
            }
        }

    }



    jump()
    {

        if (WormAnimationManger.playerAttentionSemaphore == 0)
        {
            if (this.canJump > 0)
            {

                var currentPos = this.body.GetPosition();
                var forces = new b2Vec2(this.direction, -2);
                forces.Multiply(1.5);

                this.body.ApplyImpulse(forces, this.body.GetPosition());
            }

            //Once the player moves removed bouncing arrow
            if (this.arrow)
            {
                this.arrow.finished = true;
            }
        }
    }


    backFlip()
    {

        if (WormAnimationManger.playerAttentionSemaphore == 0)
        {
            if (this.canJump > 0)
            {
                // Setup a callback that once the animation finish
                // unlock it and set it to idel
                this.onAnimationFinish(function () =>
                {
                    this.setSpriteDef(Sprites.worms.wbackflp, false);
                    this.setSpriteDef(Sprites.worms.idle1, false);
                });

                //Set backflip sprite and lock the sprite
                this.setSpriteDef(Sprites.worms.wbackflp, true, true);

                var currentPos = this.body.GetPosition();
                var forces = new b2Vec2(this.direction * -1, -2);
                forces.Multiply(2.3);

                this.body.ApplyImpulse(forces, this.body.GetPosition());
            }

            //Once the player moves removed bouncing arrow
            if (this.arrow)
            {
                this.arrow.finished = true;
            }
        }
    }

    hit(damage, worm = null)
    {
        //For Networked games.

        {
            if (this.isDead == false)
            {
                if (Client.isClientsTurn())
                {
                    this.damageTake += damage;
                    var parameters = [this.name,damage];
                    Client.sendImmediately(Events.client.ACTION, new InstructionChain("wormManager.setDamageTaken",parameters));

                }              

                AssetManager.getSound("ow" + Utilies.random(1, 2)).play(0.8);

                //If worm using Jetpack, deactive it if they get hurt.
                if (this.getWeapon() instanceof JetPack)
                {
                    this.getWeapon().deactivate();
                }

                //if from same team call the player a tratitor :)
                if (worm && worm != this && worm.team == this.team)
                {
                    AssetManager.getSound("traitor").play(0.8, 10);

                } else if (worm) // if there was a worm envolved in the damage
                {
                    Utilies.pickRandomSound(["justyouwait", "youllregretthat"]).play(0.8, 10);
                }
            }
        }
    }

    //Sets the current worm to active by placing a bouncing arrow
    // over their head and panning the camera toward him.
    activeWorm()
    {
        var pos = Physics.vectorMetersToPixels(this.body.GetPosition());
        this.arrow = new BounceArrow(pos);
        GameInstance.miscellaneousEffects.add(this.arrow);
    }

    //Is this the current worm of the current player
    isActiveWorm()
    {
        return this.team.getCurrentWorm() == this && GameInstance.state.getCurrentPlayer().getTeam() == this.team;
    }

    update()
    {
        if (this.isDead == false)
        {

            this.soundDelayTimer.update();

            //Manages the different states of the animation
            this.stateAnimationMgmt.update();

            //updates the current sprite
            super.update();

            // Always reset to idle
            this.stateAnimationMgmt.setState(WormAnimationManger.WORM_STATE.idle);

            if (this.isActiveWorm())
                this.team.getWeaponManager().getCurrentWeapon().update();

            this.target.update();

        } else
        {
            //Quick hack to get the sprite to unlock
            // Seems the die squence locks the sprite
            if (Sprites.worms.die == this.spriteDef)
            {
                this.setSpriteDef(Sprites.worms.die, false);
                this.setSpriteDef(Sprites.particleEffects[this.team.graveStone], true);
            }

            // Once the sprite animation has reached the end, then change the framIncremter so it goes
            // back down though the sprites again and then back up etc.
            if (this.getCurrentFrame() >= this.getTotalFrames() - 1)
            {
                this.setCurrentFrame(this.getTotalFrames() - 1);
                this.frameIncremeter *= -1;

            } else if (this.getCurrentFrame() <= 0)
                {
                this.setCurrentFrame(0);
                this.frameIncremeter *= -1;
            }

            super.update();
        }

    }

    draw(ctx)
    {
        this.team.getWeaponManager().getCurrentWeapon().draw(ctx);

        if (Sprites.worms.weWon != this.spriteDef && this.isActiveWorm())
        {
            if (this.isDead == false)
                this.target.draw(ctx);
        }

        ctx.save()

        var radius = this.fixture.GetShape().GetRadius() * Physics.worldScale;

        ctx.translate(
            Physics.metersToPixels(this.body.GetPosition().x),
            Physics.metersToPixels(this.body.GetPosition().y)
        )


        ctx.save()
        if (this.direction == Worm.DIRECTION.right)
        {
            // Used to flip the sprites       
            ctx.scale(-1, 1);
        }

        super.draw(ctx,
            -this.getFrameWidth() / 2,
            -this.getFrameHeight() / 1.5);

        ctx.restore()

        if (this.isDead == false)
        {
            var nameBoxX = -radius * this.name.length / 2.6;
            var nameBoxY = -radius * 6;

            ctx.drawImage(this.nameBox, nameBoxX, nameBoxY);
            ctx.drawImage(this.healthBox, -radius * 1.5, -radius * 4);
        }

        ctx.restore()

        if (this.isActiveWorm())
        {
            this.getWeapon().getForceIndicator().draw(ctx, this);
        }
    }

}

class WormDataPacket
{
    name;
    position;

    constructor(worm: Worm)
    {
        this.name = worm.name;
        this.position = worm.body.GetPosition();
    }

    override(worm: Worm)
    {
        worm.name = this.name;
        worm.body.SetPosition(new b2Vec2(this.position.x, this.position.y));
        worm.preRendering(); // Regenerate their names
    }
}