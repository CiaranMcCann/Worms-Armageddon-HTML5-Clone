/**
 * Team
 * This manages all the worms a player controls and it also stores the weapons 
 * manager which controls what weapons a player has at there disposal.
 * It is also reponsibale for updating and drawing all the worms
 *
 *  License: Apache 2.0
 *  author:  Ciarán McCann
 *  url: http://www.ciaranmccann.me/
 */
///<reference path="Worm.ts"/>
///<reference path="system/Utilies.ts"/>
///<reference path="weapons/WeaponManager.ts"/>


class Team
{
    worms: Worm[];
    currentWorm: number;
    weaponManager: WeaponManager;
    color;
    name;
    teamId;

    static teamCount = 0;


    constructor ()
    {

        //Random color - Credit Paul Irish
        this.color = '#' + Math.floor(Math.random() * 16777215).toString(16);


        this.name = "Team " + Team.teamCount;
        this.teamId = Team.teamCount;
        Team.teamCount++;

        this.weaponManager = new WeaponManager();

        this.currentWorm = 0;
        this.worms = [];
        for (var i = 0; i < 2; i++)
        {
            this.worms.push(new Worm(this, Utilies.random(1100, 1300), -2));
        }
    }

    getPercentageHealth()
    {
        var totalHealth = 0;

        for (var worm in this.worms)
        {
            totalHealth += this.worms[worm].health;
        }

        return totalHealth/this.worms.length;
    }

    isTeamDie()
    {
        return this.worms.length == 0;
    }

    getCurrentWorm()
    {
        return this.worms[this.currentWorm];
    }

    updateCurrentWorm()
    {
        if (this.currentWorm + 1 == this.worms.length)
        {
            this.currentWorm = 0;
        }
        else
        {
            this.currentWorm++;
        }
    }

    getWeaponManager()
    {
        return this.weaponManager;
    }

    setCurrentWorm(wormIndex)
    {
        this.currentWorm = wormIndex;
    }

    // Beware using this inside the update will case problems
    removeWorm(predicate)
    {
        var cachedLenght = this.worms.length;
        for (var i = 0; i < cachedLenght; i++)
        {
            if ( predicate(this.worms[i]) )
            {
                //Clean up the worms physics body
                Physics.world.DestroyBody(this.worms[i].body);

                Utilies.deleteFromCollection(this.worms, i);
                return true;
            }
        }   
        
         return false;    
    }

    //Sets all worms sprites to winning state
    winner()
    {
        // If already in winning animation no need to reset it
        if (this.worms[0].spriteDef != Sprites.worms.weWon)
        {
            for (var w in this.worms)
            {
                var worm: Worm = this.worms[w];
                worm.setSpriteDef(Sprites.worms.weWon, true);
            }
            AssetManager.sounds["victory"].play(1,10);
        }

    }


    update()
    {
        //TODO: You could pobly remove in the update just manipluate i, will do late anyway. 
        this.removeWorm(function (worm : Worm)
        {
            return worm.isReadyToBeDeleted;
        });

        var cachedLenght = this.worms.length;
        for (var i = 0; i < cachedLenght; i++)
        {
            this.worms[i].update();
        }
    }

    draw(ctx)
    {
        
        var cachedLenght = this.worms.length;
        for (var i = 0; i < cachedLenght; i++)
        {
            this.worms[i].draw(ctx);
        }

    }


}