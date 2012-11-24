
///<reference path="BaseWeapon.ts"/>
///<reference path="ThrowableWeapon.ts"/>

class HolyGrenade extends ThrowableWeapon
{
    // icon
    // sprites for worm
    // sprites for explosions
    // possibly other sprites

    constructor ()
    {
        super(
            "Holy Grenade", // Weapon name
            5, // ammo
            Sprites.weaponIcons.holyGernade, //Icon for menu
            Sprites.weapons.holyGernade //Inital weapon object state
        );
    }


    //activate(worm) 
    //{ 
    //    super.activate(worm);
    //};


    //update()
    //{   
    //    super.update();
    //}

    //draw(ctx) { 
    //    super.draw(ctx);
    //}

}