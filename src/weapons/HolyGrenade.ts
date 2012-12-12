
///<reference path="BaseWeapon.ts"/>
///<reference path="ThrowableWeapon.ts"/>

class HolyGrenade extends ThrowableWeapon
{

    constructor ()
    {
        super(
            "Holy Grenade", // Weapon name
            0, // ammo
            Sprites.weaponIcons.holyGernade, //Icon for menu
            Sprites.weapons.holyGernade, //Inital weapon object state
            Sprites.worms.takeOutHolyGernade,
            Sprites.worms.aimHolyGernade
        );

        // The area in pxiels that get cut out of the terrain
        this.explosionRadius = 125;

        // Force/worm damge radius
        this.effectedRadius = Physics.pixelToMeters(250);

        // force scaler
        this.explosiveForce = 120

        //hit damage at center
        this.maxDamage = 50;
    }

    update()
    {
        if (this.detonationTimer.getTimeLeft() <= 3)
        {
            AssetManager.sounds["HOLYGRENADE"].play();
        }

        super.update();
    }

}