///<reference path="../Graphics.ts"/>
///<reference path="../AssetManager.ts"/>
///<reference path="../Physics.ts"/>
///<reference path="../Terrain.ts"/>

class ThrowableWeapon {

    body;
    fixture;
    image;
    detonationCounter;
    timeToLive;

    constructor (x, y, image) {

        this.image = image;

        this.detonationCounter = 6;
        this.timeToLive = 1000;

        var fixDef = new b2FixtureDef;
        fixDef.density = 1.0;
        fixDef.friction = 3.5;
        fixDef.restitution = 0.3;
        fixDef.shape = new b2CircleShape((image.width / 4) / Physics.worldScale);

        var bodyDef = new b2BodyDef;
        bodyDef.type = b2Body.b2_dynamicBody;
        bodyDef.position.x = x;
        bodyDef.position.y = y;

        this.fixture = Physics.world.CreateBody(bodyDef).CreateFixture(fixDef);
        this.body = this.fixture.GetBody();
    }

    update(terrainRef: Terrain) {

        if (this.detonationCounter > 0) {
            this.detonationCounter -= 1 / 60;
        }

        if (this.detonationCounter <= 1 && this.timeToLive > 0) {

            terrainRef.addToDeformBatch(
               this.body.GetPosition().x * Physics.worldScale,
               this.body.GetPosition().y * Physics.worldScale,
               Utilies.random(32, 80));

            this.timeToLive = -1;


            var aabb = new b2AABB();
            aabb.lowerBound.Set(this.body.GetPosition().x-1, this.body.GetPosition().y-1);
            aabb.upperBound.Set(this.body.GetPosition().x+ 1, this.body.GetPosition().x+1);

            var count: Number = Physics.world.QueryAABB(function (fixture) => 
            {     
                
              if(fixture.GetBody().GetType() != b2Body.b2_staticBody) {
              
                fixture.GetBody().SetPosition(new b2Vec2(0,0));
                console.log( fixture.GetBody());
                //fixture.GetBody().ApplyTorque(5000);
                //Physics.world.DestroyBody(fixture.GetBody());

               }
            },aabb);
        }
    }

    draw(ctx) {

        //if (this.timeToLive > 0) 
         {
            ctx.save()

            ctx.translate(
            this.body.GetPosition().x * Physics.worldScale,
            this.body.GetPosition().y * Physics.worldScale
            )

            ctx.save()
            ctx.rotate(this.body.GetAngle())

            var radius = this.fixture.GetShape().GetRadius() * 2 * Physics.worldScale;

            ctx.drawImage(this.image,
                -radius,
                -radius,
                radius * 2,
                radius * 2);

            ctx.restore()

            // ctx.fillStyle = 'rgba(0,0,0,255)';
            // ctx.fillRect(radius/2, -radius / 2, 10, 10);

            ctx.fillStyle = 'rgba(255,0,0,255)';
            ctx.fillText(Math.floor(this.detonationCounter), radius / 2, 0);

            ctx.restore()
        }

    }

}
