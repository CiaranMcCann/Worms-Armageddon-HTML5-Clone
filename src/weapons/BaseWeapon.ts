///<reference path="../Settings.ts" />

class BaseWeapon
{
    ammo;
    name;
    iconImageUrl;

    constructor (name,ammo, iconImage = Settings.REMOTE_ASSERT_SERVER + "data/images/weaponicons/" + name.toLowerCase() + ".png")
    {
        this.ammo = ammo;
        this.name = name;
        this.iconImageUrl = iconImage;
    }


    activate(x,y,initalVelocity) { };
    update() { }
    draw(ctx) { }
}