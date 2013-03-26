/////<reference path="BaseWeapon.ts"/>
/////<reference path="ThrowableWeapon.ts"/>

//class LandMine extends ThrowableWeapon
//{
//    countDownTicks: number;

//    constructor (ammo)
//    {
//         //Modify the takeout animation, to be used as its idel animation or aiming animations
//        // though you don't aim dynamaie. It just happens to be easy subclass of Throwable
//        var modifedSpriteDef = Utilies.copy( new Object(), Sprites.worms.takeOutLandMine);
//        modifedSpriteDef.frameY = modifedSpriteDef.frameCount-1;

//        super(
//            "LandMine", // Weapon name
//            ammo, // ammo
//            Sprites.weaponIcons.landMine, //Icon for menu
//            Sprites.weapons.mineOn, //Inital weapon object state
//            Sprites.worms.takeOutLandMine,
//            modifedSpriteDef
//        );
        
//        //So the sprite doesn't animate
//        this.sprite.finished = true;

//        this.explosionRadius = 100;

//        // Force/worm damge radius
//        this.effectedRadius = Physics.pixelToMeters(this.explosionRadius * 1.8);

//        // force scaler
//        this.explosiveForce = 95;

//        // No requirement for crosshairs aiming
//        this.requiresAiming = false;

//        //Sound its makes when it collides with somthing
//        this.impactSound = "MINEIMPACT";

//        this.countDownTicks = 0;
//    }

//    playWormVoice()
//    {
//        Utilies.pickRandomSound(["laugh"]).play();
//    }

//    //Gets the direction of aim from the target and inital velocity
//    // The creates the box2d physics body at that pos with that inital v
//    setupDirectionAndForce(worm: Worm)
//    {
//        var initalPosition = worm.body.GetPosition();
//        this.setupPhysicsBodies(initalPosition, new b2Vec2(0, 0));
//    }


//    update()
//    {
//        if (this.getIsActive())
//        {
//            this.sprite.update();

            
//            if (this.countDownTicks != Math.floor(this.detonationTimer.getTimeLeftInSec() / 10))
//            {
//                this.countDownTicks = Math.floor(this.detonationTimer.getTimeLeftInSec() / 10);
//                AssetManager.getSound("MINETICK").play(1);

//                if (this.sprite.spriteDef == Sprites.weapons.mineOn)
//                {
//                    this.sprite.swapSpriteSheet(Sprites.weapons.mineOff);
//                } else
//                {
//                    this.sprite.swapSpriteSheet(Sprites.weapons.mineOn);
//                }
//            }

//            super.update();
//        }

//    }

//}

