/**
 * NinjaRope.js
 *
 *  License: Apache 2.0
 *  author:  Ciarán McCann
 *  url: http://www.ciaranmccann.me/
 */
///<reference path="../system/Graphics.ts"/>
///<reference path="../system/AssetManager.ts"/>
///<reference path="../system/Physics.ts"/>
///<reference path="../Terrain.ts"/>
///<reference path="BaseWeapon.ts"/>


class NinjaRope extends BaseWeapon
{
    ropeJoint;
    anchor;

    constructor ()
    {
        super(
           "Ninja Rope",
           3,
         Sprites.weaponIcons.ninjaRope,
         Sprites.worms.takeNinjaRope,
         Sprites.worms.aimNinjaRope
       );

    }

    createAnchor(contact)
    {
        var fixDef = new b2FixtureDef;
        fixDef.density = 1.0;
        fixDef.friction = 1.0;
        fixDef.restitution = 0.0;
        fixDef.shape = new b2PolygonShape;
        fixDef.shape.SetAsBox(0.03, 0.03);

        var bodyDef = new b2BodyDef;
        bodyDef.type = b2Body.b2_staticBody;
        bodyDef.position.x = contact.x;
        bodyDef.position.y = contact.y;

        this.anchor = Physics.world.CreateBody(bodyDef).CreateFixture(fixDef).GetBody()

        fixDef.shape = new b2CircleShape(0.15);

    }

    activate(worm: Worm)
    {


        if (!this.getIsActive())
        {

            var dir = worm.target.getTargetDirection().Copy();
            dir.Multiply(20);
            var contact = Physics.shotRay(worm.body.GetPosition(), dir);

            if (contact)
            {




                var joint = new b2DistanceJointDef();
                joint.frequencyHz = 10.0;
                joint.dampingRatio = 50.0;

                var prevBody = this.anchor;
                var direction = this.anchor.GetPosition().Copy();
                var wormPos = worm.body.GetPosition().Copy();
                wormPos.Subtract(direction);
                wormPos.Normalize();
                direction = wormPos;

                for (var i = 1; i < 6; ++i)
                {
                    var bd = new b2BodyDef();
                    bd.type = b2Body.b2_dynamicBody;

                    var pos = this.anchor.GetPosition().Copy();
                    var dScaled = direction.Copy();
                    dScaled.Multiply(1.5 * i);
                    pos.Add(dScaled);


                    bd.position.SetV(pos);

                    var nextBody;
                    if (i == 5)
                    {
                        //joint.frequencyHz = 1.0;
                        joint.dampingRatio = 25.0;
                        nextBody = worm.body;
                    }
                    else
                    {
                        nextBody = Physics.world.CreateBody(bd)
                        nextBody.CreateFixture(fixDef);
                        nextBody.SetFixedRotation(true);
                    }
                    joint.bodyA = prevBody;
                    joint.bodyB = nextBody;


                    Physics.world.CreateJoint(joint);
                    prevBody = nextBody;
                }

                Physics.world.CreateJoint(joint);

            }
        } else
        {

            Physics.world.DestroyBody(this.anchor);
            // Physics.world.DestroyJoint(this.ropeJoint);
        }

        super.activate(worm);
    }

    draw(ctx)
    {

    }

}