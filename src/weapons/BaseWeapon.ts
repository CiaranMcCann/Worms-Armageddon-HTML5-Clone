///<reference path="../Settings.ts" />
///<reference path="../animation/SpriteDefinitions.ts" />
///<reference path="../system/AssetManager.ts" />
///<reference path="ForceIndicator.ts" />

class BaseWeapon
{
    ammo;
    name;
    iconImage;
    isActive;
    worm: Worm;
    takeOutAnimations: SpriteDefinition;
    takeAimAnimations: SpriteDefinition;
    forceIndicator: ForceIndicator;

    requiresAiming: bool;

    constructor(name: string, ammo: number, iconSprite, takeOutAnimation: SpriteDefinition, takeAimAnimation: SpriteDefinition)
    {
        this.name = name;
        this.ammo = ammo;

        this.takeOutAnimations = takeOutAnimation;
        this.takeAimAnimations = takeAimAnimation;
        //Setup the icon used in the weapon menu
        this.iconImage = AssetManager.getImage(iconSprite.imageName);

        this.requiresAiming = true;

        this.setIsActive(false);

        this.forceIndicator = new ForceIndicator(0);
    }

    getForceIndicator()
    {
        return this.forceIndicator;
    }

    getIsActive() { return this.isActive; }
    setIsActive(val) { this.isActive = val; }

    deactivate()
    {
        this.worm.setSpriteDef(Sprites.worms.idle1);
        //throw new Error('abstract method, override in derived class');
    }

    activate(worm)
    {

        this.setIsActive(true);
        this.ammo--;
        this.worm = worm;

        Logger.debug(this + " was activated ");

    }

    update() { }
    draw(ctx) { }
}

