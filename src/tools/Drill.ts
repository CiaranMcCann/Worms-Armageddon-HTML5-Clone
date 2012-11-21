///<reference path="../system/Physics.ts"/>
///<reference path="../system/Utilies.ts" />
///<reference path="../Worm.ts" />
///<reference path="../animation/Sprite.ts"/>
///<reference path="../system/Timer.ts"/>

class Drill
{
    worm : Worm;
    isActive;
    ammo;
    timeBetweenExploisionsTimer : Timer;
    useDurationTimer: Timer;

    constructor ()
    {
        this.isActive = false;
        this.timeBetweenExploisionsTimer = new Timer(200);
        this.useDurationTimer = new Timer(4000);
    }

    active(worm : Worm)
    {
        this.worm = worm;
        this.isActive = true;
        this.worm.setSpriteDef(Sprites.worms.drill,true);                     
    }

    update()
    {
        if (this.isActive)
        {
            
            if ( this.useDurationTimer.hasTimePeriodPassed())
            {
                this.isActive = false;
                Logger.debug(" deactivedate ");
                this.worm.setSpriteDef(Sprites.worms.drill,false);
                this.worm.setSpriteDef(Sprites.worms.lookAround);
            }

             AssetManager.sounds["DRILL"].play();

            if (this.timeBetweenExploisionsTimer.hasTimePeriodPassed())
            {           
                Game.terrain.addToDeformBatch(Physics.metersToPixels(this.worm.body.GetPosition().x), Physics.metersToPixels(this.worm.body.GetPosition().y), 25);
            }

            this.useDurationTimer.update();
            this.timeBetweenExploisionsTimer.update();
          
        }

    }

}