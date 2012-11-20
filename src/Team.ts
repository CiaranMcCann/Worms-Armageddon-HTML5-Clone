///<reference path="Worm.ts"/>
///<reference path="system/Utilies.ts"/>
///<reference path="weapons/WeaponManager.ts"/>

// This mamnages all the worms for a said player
class Team
{
    worms: Worm[];
    currentWorm: number;
    weaponManager: WeaponManager;


    constructor ()
    {
        this.currentWorm = 0;
        this.worms = [];
        for (var i = 0; i < 2; i++)
        {
            this.worms.push(new Worm(Utilies.random(200,1300) , -2));
        }
    }

    getCurrentWorm()
    {
        return this.worms[this.currentWorm];
    }

    getWeaponManager()
    {
        return this.weaponManager;
    }

    setCurrentWorm(wormIndex)
    {
        this.currentWorm = wormIndex;
    }

    update()
    {
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