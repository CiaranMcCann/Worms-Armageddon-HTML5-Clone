///<reference path="../Graphics.ts"/>
///<reference path="../AssetManager.ts"/>
///<reference path="../Physics.ts"/>
///<reference path="../Terrain.ts"/>

class ThrowableWeapon {

    body;
    fixture;
    image;
    detonationCounter;
    effectedRadius;
    explosiveForce;
    timeToLive;
    terrainRef;

    constructor (x, y, image,terrainRef: Terrain) {

        this.image = image;
        this.terrainRef = terrainRef;

        // Force/worm damge radius
        this.effectedRadius = Physics.pixelToMeters(50);

        // force scaler
        this.explosiveForce = 15

        // Counter till bomb explodes
        this.detonationCounter = Utilies.random(4, 12);

        this.timeToLive = 1000;

        // Setup of physical body
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

    isLive() {
        if (this.timeToLive < 0) {
            return true;
        }
        else {
            return false;
        }
    }

    update() {

        // Decrements the timers on the bomb
        if (this.detonationCounter > 0) {
            this.detonationCounter -= 1 / 60;
        }

        //Checks if its time for the bomb to explode
        if (this.detonationCounter <= 1 && this.timeToLive > 0) {

            this.terrainRef.addToDeformBatch(
               this.body.GetPosition().x * Physics.worldScale,
               this.body.GetPosition().y * Physics.worldScale,
               50);

            this.timeToLive = -1;

            var aabb = new b2AABB();
            aabb.lowerBound.Set(this.body.GetPosition().x - this.effectedRadius, this.body.GetPosition().y - this.effectedRadius);
            aabb.upperBound.Set(this.body.GetPosition().x + this.effectedRadius, this.body.GetPosition().y + this.effectedRadius);

            Sound.play(AssetManager.sounds["explosion" + Utilies.random(1,3) ]);

            var count: Number = Physics.world.QueryAABB(function (fixture) =>
            {
                if (fixture.GetBody().GetType() != b2Body.b2_staticBody) {

                    var direction = fixture.GetBody().GetPosition().Copy();
                    direction.Subtract(this.body.GetPosition());
                    direction.Normalize();
                    direction.Multiply(this.explosiveForce);
                    fixture.GetBody().ApplyImpulse(direction, fixture.GetBody().GetPosition());
                }

                return true;
            }, aabb);

            //The bomb has exploded so remove it from the world
            Physics.world.DestroyBody(this.body);
        }
    }

    draw(ctx) {

        if (this.timeToLive > 0) {
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
