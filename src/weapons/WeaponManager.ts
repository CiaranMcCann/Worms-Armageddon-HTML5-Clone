///<reference path="../system/Graphics.ts"/>
///<reference path="../system/AssetManager.ts"/>
///<reference path="../system/Physics.ts"/>
///<reference path="../animation/Sprite.ts"/>
///<reference path="../tools/Drill.ts"/>

class WeaponManager
{

    private weaponsAndTools;
    private currentWeaponIndex;

    constructor ()
    {
        this.weaponsAndTools = 
        [
            new Drill()            
        ];
    }

    getCurrentWeapon()
    {
        return this.currentWeaponIndex;
    }

    setCurrentWeapon(index)
    {
        this.currentWeaponIndex = index;
    }

    getListOfWeapons()
    {
        this.weaponsAndTools;
    }


}