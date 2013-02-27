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
    graveStone: string;
    teamId;
    initalNumberOfWorms: number;

    static teamCount = 0;


    constructor (playerId)
    {

        this.color = Utilies.pickUnqine(["#FA6C1D", "#12AB00", "#B46DD2", "#B31A35", "#23A3C6","#9A4C44"], "colors");
       
        //Using strings instead of spriteDef to make it easier to sync across clients
        this.graveStone = Utilies.pickUnqine(["grave1","grave2","grave3","grave4","grave5","grave6"], "gravestones");

        this.name = "Team " + Team.teamCount;
        this.teamId = playerId;
        Team.teamCount++;

        this.weaponManager = new WeaponManager();

        this.currentWorm = 0;
        this.initalNumberOfWorms = 3;

        this.worms = [];
        for (var i = 0; i < this.initalNumberOfWorms; i++)
        {
            var tmp = Game.map.getNextSpawnPoint();
            this.worms.push(new Worm(this, tmp.x, tmp.y));

        }
    }

    getTeamNetData()
    {
        var packet = {};
        for (var w in this.worms)
        {
            packet[w] = this.worms[w].getWormNetData();
        }

        return packet;
    }

    setTeamNetData( packetStream )
    {
        for (var w in packetStream)
        {
            this.worms[w].setWormNetData(packetStream[w]);
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

    areAllWormsDead()
    {
        for (var worm in this.worms)
        {
            if (this.worms[worm].isDead == false)
            {
                return false;
            }
        }

        return true;
    }

    getCurrentWorm()
    {
        return this.worms[this.currentWorm];
    }

    nextWorm()
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
            this.nextWorm();
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

    getWorms()
    {
        return this.worms;
    }

    //Sets all worms sprites to winning state
    celebrate()
    {
            for (var w in this.worms)
            {
                var worm: Worm = this.worms[w];
                worm.setSpriteDef(Sprites.worms.weWon, true);
            }
            
            GameInstance.camera.panToPosition(Physics.vectorMetersToPixels(this.worms[0].body.GetPosition()));
            AssetManager.sounds["victory"].play(1, 15);
            AssetManager.sounds["Ireland"].play(1, 16);
    }


    update()
    {
     
        var cachedLenght = this.worms.length;
        for (var i = 0; i < cachedLenght; i++)
        {
            //if(this.worms[i].isDead == false)
            this.worms[i].update();
        }

    }

    draw(ctx)
    {

        var cachedLenght = this.worms.length;
        for (var i = 0; i < cachedLenght; i++)
        {
            //if(this.worms[i].isDead == false)
            this.worms[i].draw(ctx);
        }

    }


}

class TeamDataPacket
{
    wormsDataPacket: WormDataPacket[];
    name;
    graveStone;
    color;

    constructor(team : Team)
    {
        this.graveStone = team.graveStone;
        this.name = team.name;
        this.color = team.color;
        this.wormsDataPacket = [];

        for (var w in team.worms)
        {
            this.wormsDataPacket.push( new WormDataPacket( team.worms[w] ));
        }
    }

    override(team : Team)
    {
        team.name = this.name;
        team.graveStone = this.graveStone;
        team.color = this.color;
        
        for (var w in this.wormsDataPacket)
        {
            this.wormsDataPacket[w].override(team.getWorms()[w]);
        }

    }
}