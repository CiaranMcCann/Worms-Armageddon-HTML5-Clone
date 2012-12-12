
///<reference path="BaseWeapon.ts"/>
///<reference path="ThrowableWeapon.ts"/>

class HolyGrenade extends ThrowableWeapon
{

    constructor ()
    {
        super(
            "Holy Grenade", // Weapon name
            3, // ammo
            Sprites.weaponIcons.holyGernade, //Icon for menu
            Sprites.weapons.holyGernade, //Inital weapon object state
            Sprites.worms.takeOutHolyGernade,
            Sprites.worms.aimHolyGernade
        );

        // The area in pxiels that get cut out of the terrain
        this.explosionRadius = 145;

        // Force/worm damge radius
        this.effectedRadius = Physics.pixelToMeters(360);

        // force scaler
        this.explosiveForce = 130

        //hit damage at center
        this.maxDamage = 50;
    }

    update()
    {
        if (this.getIsActive() && this.detonationTimer.getTimeLeftInSec()/10 <= 2)
        {
            AssetManager.sounds["HOLYGRENADE"].play();
        }

        super.update();
    }

}