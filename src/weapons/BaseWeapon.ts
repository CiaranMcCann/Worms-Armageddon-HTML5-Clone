///<reference path="../Settings.ts" />

class BaseWeapon
{
    ammo;
    name;
    iconImage;
    sprite: Sprite;
    private isActive;
    timeToLive;
    worm;

    constructor (name :string,ammo : number, iconSprite)
    {
        this.name = name;
        this.ammo = ammo;
        
        this.timeToLive = 0;

         //Setup the icon used in the weapon menu
        this.iconImage = AssetManager.images[iconSprite.imageName];

        this.setIsActive(false);
    }

    getIsActive() { return this.isActive; }
    setIsActive(val) { this.isActive = val; }

    detivate()
    {
        Logger.debug(this + " was deactivated ");
        this.setIsActive(false);
    }

    activate(worm) 
    {
        this.setIsActive(true);
        this.ammo--;
        this.worm = worm;

        Logger.debug(this + " was activated ");
    };


    update() { }
    draw(ctx) { }
}

