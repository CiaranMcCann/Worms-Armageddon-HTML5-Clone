
///<reference path="BaseWeapon.ts"/>
///<reference path="ThrowableWeapon.ts"/>

class HolyGrenade extends ThrowableWeapon
{

    constructor ()
    {
        super(
            "Holy Grenade", // Weapon name
            5, // ammo
            Sprites.weaponIcons.holyGernade, //Icon for menu
            Sprites.weapons.holyGernade //Inital weapon object state
        );
    }

    update()
    {
        if (this.detonationCounter <= 3.5 && this.timeToLive > 0)
        {
            AssetManager.sounds["HOLYGRENADE"].play();
        }

        super.update();
    }

}