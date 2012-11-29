///<reference path="../Settings.ts" />

class BaseWeapon
{
    ammo;
    name;
    iconImage;
    isActive;
    timeToLive;
    worm;
    takeOutAnimations : SpriteDefinition;
    takeAimAnimations : SpriteDefinition ;

    constructor (name: string, ammo: number, iconSprite, takeOutAnimation : SpriteDefinition, takeAimAnimation : SpriteDefinition)
    {
        this.name = name;
        this.ammo = ammo;

        this.timeToLive = 0;

        this.takeOutAnimations = takeOutAnimation;
        this.takeAimAnimations = takeAimAnimation;
        //Setup the icon used in the weapon menu
        this.iconImage = AssetManager.images[iconSprite.imageName];

        this.setIsActive(false);
    }

    getIsActive() { return this.isActive; }
    setIsActive(val) { this.isActive = val; }


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

