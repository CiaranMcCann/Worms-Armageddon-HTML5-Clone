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
    ropeJoints;
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


    activate(worm: Worm)
    {


        if (!this.getIsActive())
        {

            var dir = worm.target.getTargetDirection().Copy();
            dir.Multiply(20);
            var contact = Physics.shotRay(worm.body.GetPosition(), dir);

            if (contact)
            {

                var fixDef = new b2FixtureDef;
                fixDef.density = 0.5;
                fixDef.friction = 1.0;
                fixDef.restitution = 0.0;
                fixDef.shape = new b2PolygonShape;
                fixDef.shape.SetAsBox(0.2, 0.2);

                var bodyDef = new b2BodyDef;
                bodyDef.type = b2Body.b2_staticBody;
                bodyDef.position.x = contact.x;
                bodyDef.position.y = contact.y;

                this.anchor = Physics.world.CreateBody(bodyDef).CreateFixture(fixDef).GetBody()
                fixDef.shape.SetAsBox(0.2, 0.2);
                fixDef.shape = new b2CircleShape(0.15);


                var ropeDef = new b2DistanceJointDef();
                ropeDef.frequencyHz = 10.0;
                ropeDef.dampingRatio = 50.0;

                var prevBody = this.anchor;
                var direction = this.anchor.GetPosition().Copy();
                var wormPos = worm.body.GetPosition().Copy();
                wormPos.Subtract(direction);

                var distance = 10;

                if(wormPos.Length() > distance)
                distance = Math.floor(wormPos.Length()/0.5);

                wormPos.Normalize();
                direction = wormPos;

                for (var i = 1; i < distance; ++i)
                {
                    var bd = new b2BodyDef();
                    bd.type = b2Body.b2_dynamicBody;

                    var pos = this.anchor.GetPosition().Copy();
                    var dScaled = direction.Copy();
                    dScaled.Multiply(0.5 * i);
                    pos.Add(dScaled);


                    bd.position.SetV(pos);

                    var nextBody;
                    if (i == distance-1)
                    {
                        //ropeDef.frequencyHz = 8.0;
                       // ropeDef.dampingRatio = 25.0;
                        nextBody = worm.body;
                    }
                    else
                    {
                        nextBody = Physics.world.CreateBody(bd)
                        nextBody.CreateFixture(fixDef);
                        nextBody.SetFixedRotation(true);
                    }
                    ropeDef.bodyA = prevBody;
                    ropeDef.bodyB = nextBody;
                    


                    var j = Physics.world.CreateJoint(ropeDef);
                    j.SetLength(0.2);
                    prevBody = nextBody;
                }

                Physics.world.CreateJoint(ropeDef);

            }
        } else
        {
            //Physics.world.DestroyJoint(this.ropeJoint);
           Physics.world.DestroyBody(this.anchor);
            
        }

        super.activate(worm);
    }

    draw(ctx)
    {

    }

}