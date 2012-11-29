
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

        this.explosionRadius = 100;

         // Force/worm damge radius
        this.effectedRadius = Physics.pixelToMeters(this.explosionRadius*1.8);

          // force scaler
        this.explosiveForce = this.explosionRadius * 2;
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