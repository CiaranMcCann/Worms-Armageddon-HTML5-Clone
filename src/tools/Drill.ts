///<reference path="../system/Physics.ts"/>
///<reference path="../system/Utilies.ts" />
///<reference path="../Worm.ts" />
///<reference path="../animation/Sprite.ts"/>


class Drill
{
    worm : Worm;
    isActive;
    startTime;

    constructor (worm : Worm)
    {
        worm.setSpriteDef(Sprites.worms.drill,true);
        this.worm = worm;
        this.isActive = false;
        

        Physics.addContactListener(function (contact) => {

            if (Physics.isObjectColliding(Terrain.userData, this.worm.body.GetUserData(), contact))
            {
                if (this.startTime > 0)
                {
                    Game.terrain.addToDeformBatch(Physics.metersToPixels(this.worm.body.GetPosition().x), Physics.metersToPixels(this.worm.body.GetPosition().y), 25);
                }
            }
           
            return !this.isActive;
        });
    }

    active()
    {
        this.isActive = true;
        this.startTime = Date.now();
        this.worm.setSpriteDef(Sprites.worms.drill,true);
        
        
    }

    update()
    {
        if (this.isActive)
        {
            if (Date.now() - this.startTime > 10000)
            {
                this.isActive = false;
                Logger.debug(" deactivedate ");
                this.worm.setSpriteDef(Sprites.worms.drill,false);
                this.worm.setSpriteDef(Sprites.worms.lookAround);
            }
        }

    }

}