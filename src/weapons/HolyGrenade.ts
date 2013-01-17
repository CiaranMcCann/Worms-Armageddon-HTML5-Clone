
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
        this.explosiveForce = 110

        //hit damage at center
        this.maxDamage = 50;

        //Sound its makes when it collides with somthing
        this.impactSound = "HOLYGRENADEIMPACT";
    }

   

    update()
    {
        if (this.getIsActive() && this.detonationTimer.getTimeLeftInSec()/10 <= 2)
        {
            AssetManager.sounds["holygrenade"].play();
        }

        super.update();
    }

}