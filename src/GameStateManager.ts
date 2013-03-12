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
    private currentPlayerIndex: number;
    private players: Player[];
    isStarted: bool;
    physicsWorldSettled: bool;

    constructor()
    {

        this.nextTurnTrigger = false;
        this.currentPlayerIndex = 0;
        this.isStarted = false;
        this.physicsWorldSettled = false;
    }

    init(players)
    {
        this.players = players;
        this.isStarted = true;
    }

    tiggerNextTurn()
    {
        // Stop all game info based effects, eg bouncing arrow over worms head
        GameInstance.miscellaneousEffects.stopAll();
        this.nextTurnTrigger = true;
    }

    //When the timer says its time for next turn, then we need
    // to deactivate all non-time based weapons, such as jetpacks and ropes etc.
    timerTiggerNextTurn()
    {
        GameInstance.wormManager.deactivedAllNonTimeBasedWeapons();
        this.tiggerNextTurn()
    }

    hasNextTurnBeenTiggered()
    {
        return this.nextTurnTrigger;
    }

    // Is everyone ready for the next turn, animations, the worms etc?
    readyForNextTurn()
    {
        // EVENTS which tigger next go - Eg: Modify this.nextTurnTrigger
        // firing of player weapon in some cases
        // Using up the allowed shots/use of a weapon in a turn.
        // player hurting themsleves
        // turn time up 

        if (this.nextTurnTrigger)
        {
            // REQUIRED STATES 
            // animations finished, which include particle effects.
            // deaths if any
            // players health reduced if any
            // all players most be stationary.
            if (GameInstance.particleEffectMgmt.areAllAnimationsFinished() && GameInstance.wormManager.areAllWormsReadyForNextTurn())
            {
                this.nextTurnTrigger = false;
                return true;
            }
        }

        return false;
    }


    getCurrentPlayer()
    {
        return this.players[this.currentPlayerIndex];
    }

    // Selects the next players to have a go and selects the next worm they use
    nextPlayer() : string
    {

        //Networked games need this
        this.nextTurnTrigger = false;


        if (this.currentPlayerIndex + 1 == this.players.length)
        {
            this.currentPlayerIndex = 0;
        }
        else
        {
            this.currentPlayerIndex++;
        }

        //If the team is all dead return -1 to sign move to next player.
        if (this.getCurrentPlayer().getTeam().getPercentageHealth() <= 0)
        {
            return null;
        }

        this.getCurrentPlayer().getTeam().nextWorm();
        GameInstance.camera.cancelPan();
        GameInstance.camera.panToPosition(Physics.vectorMetersToPixels(this.getCurrentPlayer().getTeam().getCurrentWorm().body.GetPosition()));

        //gives back the server id tag
        return this.getCurrentPlayer().id;
    }

    checkForWinner()
    {
        var playersStillLive = [];
        for (var i = this.players.length - 1; i >= 0; --i)
        {
            if (this.players[i].getTeam().areAllWormsDead() == false)
            {
                playersStillLive.push(this.players[i]);
            }
        }

        if (playersStillLive.length == 1)
        {
            return playersStillLive[0];

        }

        return null;
    }
}
