/**
 * WeaponManager.js
 * Each Team has a load of weapons that are managed by this class. 
 * It sotires the weapons, allow simple controlled accsse to the weapons.
 *
 *  License: Apache 2.0
 *  author:  Ciarán McCann
 *  url: http://www.ciaranmccann.me/
 */
///<reference path="../system/Graphics.ts"/>
///<reference path="../system/AssetManager.ts"/>
///<reference path="../system/Physics.ts"/>
///<reference path="../animation/Sprite.ts"/>
///<reference path="../weapons/Drill.ts"/>
///<reference path="../weapons/ThrowableWeapon.ts"/>

class WeaponManager
{

    private weaponsAndTools: BaseWeapon[];
    private currentWeaponIndex;

    constructor ()
    {
        this.weaponsAndTools = 
        [
            new Drill(),
            new ThrowableWeapon()
        ];

        this.currentWeaponIndex = 0;
    }

 
    checkWeaponHasAmmo(weaponIndex)
    {
        if (this.weaponsAndTools[weaponIndex].ammo)
        {
            return true;
        }

        return false;
    }

    getCurrentWeapon()
    {
        return this.weaponsAndTools[this.currentWeaponIndex];
    }

    setCurrentWeapon(index)
    {
        this.currentWeaponIndex = index;
    }

    getListOfWeapons()
    {
        return this.weaponsAndTools;
    }


}