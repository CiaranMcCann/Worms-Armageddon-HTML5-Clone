///<reference path="../system/Graphics.ts"/>
///<reference path="../system/AssetManager.ts"/>
///<reference path="../system/Physics.ts"/>
///<reference path="../Terrain.ts"/>

// Projectiles explode when they collide with somthing
// thats the main different between them and throwable weapons
class ProjectileWeapon
{

    body;
    fixture;
    image;
    listener;
    terrainRef;
    effectedRadius;
    explosiveForce;
    isLive;

    constructor (x, y, image, terrainRef: Terrain)
    {

        this.image = image;
        this.terrainRef = terrainRef;
        this.isLive = true;

        // Force/worm damge radius
        this.effectedRadius = Physics.pixelToMeters(30);

        // force scaler
        this.explosiveForce = 15

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
        this.body.SetUserData("projectileweapon" + x + y); //Give it a unqine name


        // Setup callback function for when the projectile collides with the terrain
        Physics.addContactListener(function (contact) => {

            var UserDataA = contact.GetFixtureA().GetBody().GetUserData();
            var UserDataB = contact.GetFixtureB().GetBody().GetUserData();

            // If the contact is with the terrain and THIS body
            if ((UserDataA == "terrain" && UserDataB == this.body.GetUserData()))
            {

                Logger.debug("Exploded");
                this.terrainRef.addToDeformBatch(
                     this.body.GetPosition().x * Physics.worldScale,
                     this.body.GetPosition().y * Physics.worldScale,
                     Utilies.random(32, 80)
                );

                var aabb = new b2AABB();
                aabb.lowerBound.Set(this.body.GetPosition().x - this.effectedRadius, this.body.GetPosition().y - this.effectedRadius);
                aabb.upperBound.Set(this.body.GetPosition().x + this.effectedRadius, this.body.GetPosition().y + this.effectedRadius);

                AssetManager.sounds["explosion" + Utilies.random(1, 3)].play();

                //find dynamic bodies inside the effectedRadius and apply a impluse
                Physics.world.QueryAABB(function (fixture) =>
                {
                    if (fixture.GetBody().GetType() != b2Body.b2_staticBody)
                    {

                        var direction = fixture.GetBody().GetPosition().Copy();
                        direction.Subtract(this.body.GetPosition());
                        direction.Normalize();
                        direction.Multiply(this.explosiveForce);
                        fixture.GetBody().ApplyImpulse(direction, fixture.GetBody().GetPosition());
                    }

                    return true;
                }, aabb);

                // Set this object to dead so it can be cleaned up 
                this.isLive = false;

                // so that this callback is removed from the list of contactlistener functions
                return true;

            }

            return false;
        });

    }

    update()
    {
        if (!this.isLive)
        {
            //The bomb has exploded so remove it from the world
            Physics.world.DestroyBody(this.body);
        }
    }

    draw(ctx)
    {

        if (this.isLive)
        {
            ctx.save()

            ctx.translate(
            this.body.GetPosition().x * Physics.worldScale,
            this.body.GetPosition().y * Physics.worldScale
            )

            ctx.rotate(this.body.GetAngle())

            var radius = this.fixture.GetShape().GetRadius() * 2 * Physics.worldScale;

            ctx.drawImage(this.image,
                -radius,
                -radius,
                radius * 2,
                radius * 2);

            ctx.restore()
        }
    }

}
