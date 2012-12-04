
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
            Sprites.weapons.holyGernade, //Inital weapon object state
            Sprites.worms.takeOutHolyGernade,
            Sprites.worms.aimHolyGernade
        );

        // The area in pxiels that get cut out of the terrain
        this.explosionRadius = 100;

        // Force/worm damge radius
        this.effectedRadius = Physics.pixelToMeters(250);

        // force scaler
        this.explosiveForce = 120

        //hit damage at center
        this.maxDamage = 40;
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