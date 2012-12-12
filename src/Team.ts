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
///<reference path="animation/BounceArrow.ts"/>


class Team
{
    worms: Worm[];
    currentWorm: number;
    weaponManager: WeaponManager;
    color;
    name;
    teamId;
    initalNumberOfWorms: number;

    static teamCount = 0;


    constructor ()
    {

        //Random color - Credit Paul Irish
        //this.color = '#' + Math.floor(Math.random() * 16777215).toString(16);
        this.color = Utilies.pickUnqine(["#FA6C1D", "#12AB00", "#B46DD2", "#B31A35", "#23A3C6","#9A4C44"], "colors");


        this.name = "Team " + Team.teamCount;
        this.teamId = Team.teamCount;
        Team.teamCount++;

        this.weaponManager = new WeaponManager();

        this.currentWorm = 0;
        this.initalNumberOfWorms = 4;

        this.worms = [];
        for (var i = 0; i < this.initalNumberOfWorms; i++)
        {
            var tmp = Game.map.getNextSpawnPoint();
            this.worms.push(new Worm(this, tmp.x, tmp.y));

        }
    }

    getPercentageHealth()
    {
        var totalHealth = 0;

        for (var worm in this.worms)
        {
            totalHealth += this.worms[worm].health;
        }

        return totalHealth / this.initalNumberOfWorms;
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

        if (this.worms[this.currentWorm].isDead)
        {
            this.updateCurrentWorm();
        } else
        {
            this.worms[this.currentWorm].activeWorm();
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
            AssetManager.sounds["victory"].play(1, 10);
        }

    }


    update()
    {
     
        WormAnimationManger.areAllWormsAtRest = true;
        var cachedLenght = this.worms.length;
        for (var i = 0; i < cachedLenght; i++)
        {
            if(this.worms[i].isDead == false)
            this.worms[i].update();
        }

        if (GameInstance.getCurrentPlayerObject().turnFinished &&
             WormAnimationManger.playerAttentionSemaphore == 0 &&
            WormAnimationManger.areAllWormsAtRest)
        {
            GameInstance.nextPlayer();
            GameInstance.getCurrentPlayerObject().turnFinished = false;
        }


    }

    draw(ctx)
    {

        var cachedLenght = this.worms.length;
        for (var i = 0; i < cachedLenght; i++)
        {
            if(this.worms[i].isDead == false)
            this.worms[i].draw(ctx);
        }

    }


}