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
///<reference path="../weapons/HolyGrenade.ts"/>
///<reference path="../weapons/HandGrenade.ts"/>
///<reference path="../weapons/Dynamite.ts"/>
///<reference path="../weapons/NinjaRope.ts"/>
///<reference path="../weapons/JetPack.ts"/>
///<reference path="../weapons/RayWeapon.ts"/>
///<reference path="../weapons/Shotgun.ts"/>
///<reference path="../weapons/Minigun.ts"/>

class WeaponManager
{

    private weaponsAndTools: BaseWeapon[];
    private currentWeaponIndex;

    constructor ()
    {
        this.weaponsAndTools = 
        [
            new Drill(),
            new HandGrenade(),
            new JetPack(),           
            new NinjaRope(),
            new HolyGrenade(),
            new Dynamite(),
            new Shotgun(),      
            new Minigun(),             
        ];

        this.currentWeaponIndex = 1;
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
        if (this.getCurrentWeapon().getIsActive() == false || this.getCurrentWeapon() instanceof JetPack || this.getCurrentWeapon() instanceof NinjaRope)
        {
            this.currentWeaponIndex = index;
        }
    }

    getListOfWeapons()
    {
        return this.weaponsAndTools;
    }


}