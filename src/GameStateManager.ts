/**
 * GameStateManager.js
 *
 *  License: Apache 2.0
 *  author:  Ciarán McCann
 *  url: http://www.ciaranmccann.me/
 */
///<reference path="system/Camera.ts"/>
///<reference path="system/Graphics.ts"/>
///<reference path="system/AssetManager.ts"/>
///<reference path="system/Physics.ts"/>
///<reference path="Worm.ts"/>
///<reference path="system/Utilies.ts"/>
///<reference path="system/Timer.ts" />
///<reference path="Settings.ts" />

class GameStateManager
{
    private nextTurnTrigger: bool;

    constructor ()
    {
        this.nextTurnTrigger = false;
    }

    tiggerNextTurn()
    {
        this.nextTurnTrigger = true;
    }

    hasNextTurnBeenTiggered()
    {
        return this.nextTurnTrigger;
    }

    readyForNextTurn()
    {
        
        if (this.nextTurnTrigger)
        {
            // Check states
            if (
                GameInstance.particleEffectMgmt.areAllAnimationsFinished() &&
                GameInstance.wormManager.areAllWormsReadyForNextTurn()              
                )
            {
                this.nextTurnTrigger = false;
                GameInstance.miscellaneousEffects.stopAll();
                return true;
            }



        }

        return false;

        // REQUIRED STATES 
        // animations finished, which include particle effects.
        // deaths if any
        // players health reduced if any
        // all players most be stationary.

        // EVENTS which tigger next go
        // firing of player weapon in some cases
        // Using up the allowed shots/use of a weapon in a turn.
        // player hurting themsleves
        // turn time up 
        
        

    }

}
