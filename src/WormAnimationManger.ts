/**
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
///<reference path="system/Timer.ts" />
///<reference path="Main.ts" />
///<reference path="Worm.ts" />

class WormAnimationManger
{
    static WORM_STATE = {

        idle: 0,
        walking: 1,
        jumping: 2,
        failing: 3,
        aiming: 4

    }

    // When greater then zero the users attention is in use by another sprite
    static playerAttentionSemaphore = 0;

    worm: Worm;
    idleTimer: Timer;
    currentState;
    previouslySelectedWeapon;

    constructor (worm: Worm)
    {
        this.worm = worm;
        this.currentState = WormAnimationManger.WORM_STATE.idle;
        this.idleTimer = new Timer(100);
        this.previouslySelectedWeapon = this.worm.team.getWeaponManager().getCurrentWeapon();
    }

    setState(state)
    {
        this.currentState = state;
    }


    getState()
    {
        return this.currentState;
    }

    setIdleAnimation()
    {
        // If this worm is the worm of the current player and its not in a dieing state
        if (this.worm.isActiveWorm() && this.worm.spriteDef != Sprites.worms.die)
        {
            //If the worm is the current worm its idel will be to take out its weapon

            this.worm.setSpriteDef(this.worm.team.getWeaponManager().getCurrentWeapon().takeOutAnimations, false, true);

            // Once the animation to take out the weapon is finished then display this still image, which is the aiming image 
            // most of the time, depending on the type or weapon or tool.
            this.worm.onAnimationFinish(function () =>
            {
                this.worm.setSpriteDef(this.worm.team.getWeaponManager().getCurrentWeapon().takeAimAnimations);
                this.worm.finished = true;
                this.currentState = WormAnimationManger.WORM_STATE.aiming;
            });


        } else
        {
            // If not current worm just normal idel.
            if (this.worm.health > 30)
            {
                this.worm.setSpriteDef(Sprites.worms.idle1);
            } else
            {
                this.worm.setSpriteDef(Sprites.worms.hurt);
            }
        }
    }

    update()
    {
   
        //Only play the death animation if the player is die first
        // Also they have come to a stop 
        if (GameInstance.wormManager.areAllWormsStationary() &&
            this.worm.health == 0 &&
            WormAnimationManger.playerAttentionSemaphore == 0 &&
            this.worm.spriteDef != Sprites.worms.die )
        {
            WormAnimationManger.playerAttentionSemaphore++;

            GameInstance.camera.panToPosition(Physics.vectorMetersToPixels(this.worm.body.GetPosition()));
            
            //Set the onFinishAnimation now as once the spriteDef is locked 
            // can't modify it
            this.worm.onAnimationFinish(function () =>
            {
                // Once the players death animated is finished then we most create
                // a particle explision effect and pay an explosion sound.

                //flag to let the team know to not update it
                this.worm.isDead = true;

                var effectedRadius = Physics.pixelToMeters(50);
                var maxDamage = 10;
                var explosiveForce = 20;
                var explosionRadius = 40;

                var animation = Effects.explosion(
                     this.worm.body.GetPosition(),
                     explosionRadius,
                     effectedRadius,
                     explosiveForce,
                     maxDamage
                 );

                animation.onAnimationFinish(function () =>
                {
                    //All animations to do with death are finished so derement semaphore
                    WormAnimationManger.playerAttentionSemaphore--;
                });           
            });          
            this.worm.setSpriteDef(Sprites.worms.die, true, true);
            this.worm.setNoLoop(true);

            Utilies.pickRandomSound(["byebye", "ohdear", "fatality"]).play(1, 2);
        }

            // Once the player comes to a rest then we trigger the reduce health animation
         // if they have been hurt 
         if (GameInstance.wormManager.areAllWormsStationary() && this.worm.damageTake > 0)
         {
            
            WormAnimationManger.playerAttentionSemaphore++;
            var animation = new ToostMessage(Physics.vectorMetersToPixels(this.worm.body.GetPosition()), this.worm.damageTake, this.worm.team.color);
            animation.onAnimationFinish(function () =>
            {
                WormAnimationManger.playerAttentionSemaphore--;
                GameInstance.healthMenu.update(this.worm.team);

                //If the worm hurt himself his go is over
                if (GameInstance.state.getCurrentPlayer().getTeam().getCurrentWorm() == this.worm)
                {
                    GameInstance.state.tiggerNextTurn();
                }

            });

            GameInstance.particleEffectMgmt.add(animation);

            this.worm.setHealth(this.worm.getHealth() - this.worm.damageTake);
            this.worm.damageTake = 0;
        }


        //If the players weapon has changed since the last update we need to reply the animation of him taking it out
        if (this.previouslySelectedWeapon != this.worm.team.getWeaponManager().getCurrentWeapon())
        {
            this.previouslySelectedWeapon = this.worm.team.getWeaponManager().getCurrentWeapon();
            this.setIdleAnimation();
        }


        if (this.currentState == WormAnimationManger.WORM_STATE.walking)
        {
            this.worm.setSpriteDef(Sprites.worms.walking);
            this.idleTimer.reset();
        }


        // Animation states to do with jumping
        if (this.worm.canJump == 0 && this.worm.body.GetLinearVelocity().y > 0)
        {
            this.worm.setSpriteDef(Sprites.worms.falling);
            this.currentState = WormAnimationManger.WORM_STATE.failing;
            this.idleTimer.reset();

        }
        else if (this.worm.canJump == 0 && this.worm.body.GetLinearVelocity().y < 0)
            {
            this.worm.setSpriteDef(Sprites.worms.jumpBegin);
            this.currentState = WormAnimationManger.WORM_STATE.jumping;
            this.idleTimer.reset();
        }


        //Once the idel timer has run out we which to idel animation and pause the timer
        // as some of the idel animations are animated and some are not. 
        if (this.idleTimer.hasTimePeriodPassed())
        {
            this.idleTimer.pause();
            this.setIdleAnimation();
        }


        this.idleTimer.update();

    }

}