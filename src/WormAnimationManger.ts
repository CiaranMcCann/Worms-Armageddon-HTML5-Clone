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

    constructor (worm : Worm)
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

            this.worm.setSpriteDef(this.worm.team.getWeaponManager().getCurrentWeapon().takeOutAnimations, false,true);
            
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

        var hasComeToRest = Utilies.isBetweenRange(this.worm.body.GetLinearVelocity().y, 0.001, -0.001) && Utilies.isBetweenRange(this.worm.body.GetLinearVelocity().x, 0.001, -0.001);

        if (hasComeToRest &&
           this.worm.damageTake > 0)
            // while partle effects empty
        {
           // var 
        }
           


        //Only play the death animation if the player is die first
        // Also they have come to a stop 
        if (hasComeToRest &&  
            this.worm.health == 0 &&
            this.worm.spriteDef != Sprites.worms.die &&
            WormAnimationManger.playerAttentionSemaphore == 0)
        {
            WormAnimationManger.playerAttentionSemaphore++;

            GameInstance.camera.panToPosition(Physics.vectorMetersToPixels(this.worm.body.GetPosition()));
            this.worm.setSpriteDef(Sprites.worms.die, true,true);
            this.worm.setNoLoop(true);
            this.worm.onAnimationFinish(function () =>
            {
                this.worm.onDeath();
                WormAnimationManger.playerAttentionSemaphore--;

            });

            Utilies.pickRandomSound(["byebye","ohdear"]).play(1,2);
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