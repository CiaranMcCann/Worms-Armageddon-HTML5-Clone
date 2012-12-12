
///<reference path="BaseWeapon.ts"/>
///<reference path="ThrowableWeapon.ts"/>

class HandGrenade extends ThrowableWeapon
{

    constructor ()
    {
        super(
            "Hand Grenade", // Weapon name
            9, // ammo
            Sprites.weaponIcons.gernade, //Icon for menu
            Sprites.weapons.gernade, //Inital weapon object state
            Sprites.worms.takeOutGernade,
            Sprites.worms.aimGernade
        );

        // The area in pxiels that get cut out of the terrain
        this.explosionRadius = 60;

        // Force/worm damge radius
        this.effectedRadius = Physics.pixelToMeters(150);

        // force scaler
        this.explosiveForce = 80

        //hit damage at center
        this.maxDamage = 20;

        this.detonationTimer = new Timer(3000);
    }

    deactivate()
    {
        super.deactivate();
    }

}