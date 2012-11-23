///<reference path="../Settings.ts" />

class BaseWeapon
{
    ammo;
    name;
    iconImageUrl;
    isActive;

    constructor (name,ammo, iconImage = Settings.REMOTE_ASSERT_SERVER + "data/images/weaponicons/" + name.toLowerCase() + ".png")
    {
        this.ammo = ammo;
        this.name = name;
        this.iconImageUrl = iconImage;
        this.isActive = false;
    }


    activate(worm) { };
    update() { }
    draw(ctx) { }
}