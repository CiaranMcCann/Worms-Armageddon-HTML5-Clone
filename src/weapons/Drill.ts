/**
 * Drill.js
 * This class manages the Drill tool which the worm
 * can use to drill down into the terrain and also hurt other worms.
 *
 *  License: Apache 2.0
 *  author:  Ciarán McCann
 *  url: http://www.ciaranmccann.me/
 */
///<reference path="../system/Physics.ts"/>
///<reference path="../system/Utilies.ts" />
///<reference path="../Worm.ts" />
///<reference path="../animation/Sprite.ts"/>
///<reference path="../system/Timer.ts"/>
///<reference path="../Game.ts"/>
///<reference path="BaseWeapon.ts"/>


class Drill extends BaseWeapon
{
    worm: Worm;
    timeBetweenExploisionsTimer: Timer;
    useDurationTimer: Timer;

    constructor ()
    {
        super(
            "Drill", // Weapon name
            1, // ammo
            Sprites.weaponIcons.drill, //Icon for menu
            Sprites.worms.takeOutDrill, //animation fro worm taking out drill
            Sprites.worms.drilling //animation fro worm taking out drill
        );

        this.timeBetweenExploisionsTimer = new Timer(200);
        this.useDurationTimer = new Timer(4000);
    }


    activate(worm: Worm)
    {
        if (this.ammo > 0)
        {
            super.activate(worm);
            this.useDurationTimer.reset();
            this.timeBetweenExploisionsTimer.reset();
            this.worm.setSpriteDef(Sprites.worms.drilling, true);

            return true;
        } else
        {
            return false;
        }
    }

    update()
    {
        if (this.getIsActive())
        {
            var weaponUseDuration = this.useDurationTimer.hasTimePeriodPassed();
            if (weaponUseDuration)
            {
                this.setIsActive(false);
                Logger.debug(" deactivedate ");
                this.worm.setSpriteDef(Sprites.worms.drilling, false); //unlocks sprite
                this.worm.setSpriteDef(Sprites.worms.lookAround);
            }

            AssetManager.sounds["DRILL"].play();

            if (this.timeBetweenExploisionsTimer.hasTimePeriodPassed())
            {
                GameInstance.terrain.addToDeformBatch(Physics.metersToPixels(this.worm.body.GetPosition().x), Physics.metersToPixels(this.worm.body.GetPosition().y), 25);
            }

            this.useDurationTimer.update();
            this.timeBetweenExploisionsTimer.update();

        }

    }

}