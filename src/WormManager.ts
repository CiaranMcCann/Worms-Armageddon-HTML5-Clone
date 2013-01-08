/**
 * WormManager.js
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

class WormManager
{
    // This allows for global acess to all the worms in the game.
    // as each one is pushed onto it in their constructor
    allWorms: Worm[];

    constructor (players : Player[])
    {
        this.allWorms = [];

        for (var i = 0; i < players.length; i++)
        {
            var worms = players[i].getTeam().getWorms();
            for (var j = 0; j < worms.length; j++)
            {
                this.allWorms.push(worms[j]);
            }
        }

        Logger.log( this.allWorms);
    }

    // are all the worms completely finished, animations, health reduction, actions etc.
    areAllWormsReadyForNextTurn()
    {
        return WormAnimationManger.playerAttentionSemaphore == 0 && this.areAllWormsStationary() && this.areAllWormsDamageTaken() && this.areAllWeaponsDeactived();
    }

    // Are all the worms stop, not moving at all. 
    areAllWormsStationary()
    {
        for (var i = 0; i < this.allWorms.length; i++)
        {
            if (this.allWorms[i].isStationary() == false)
            {
                return false;
            }
        }

        return true;
    }

     // Are all the worms stop, not moving at all. 
    areAllWeaponsDeactived()
    {
        for (var i = 0; i < this.allWorms.length; i++)
        {
            if (this.allWorms[i].team.getWeaponManager().getCurrentWeapon().getIsActive() == true)
            {
                return false;
            }
        }

        return true;
    }

    // Are all worm accumlated damage pionts taken from their total health yet?
    areAllWormsDamageTaken()
    {
        for (var i = 0; i < this.allWorms.length; i++)
        {
            if (this.allWorms[i].damageTake != 0)
            {
                return false;
            }

            if (this.allWorms[i].getHealth() == 0 && this.allWorms[i].damageTake == 0 && this.allWorms[i].isDead == false)
            {
                return false;
            }
        }

        return true;
    }


}