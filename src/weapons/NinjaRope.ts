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
    b;

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

    activate(worm : Worm)
    {
        

        if (!this.getIsActive())
        {

            var dir = worm.target.getTargetDirection().Copy();
            dir.Multiply(20);
            var contact = Physics.shotRay(worm.body.GetPosition(), dir);

            if (contact)
            { 

                var fixDef = new b2FixtureDef;
                fixDef.density = 1.0;
                fixDef.friction = 1.0;
                fixDef.restitution = 0.0;
                fixDef.shape = new b2PolygonShape;

                var bodyDef = new b2BodyDef;
                bodyDef.type = b2Body.b2_staticBody;

		        fixDef.shape.SetAsBox(0.03,0.03);

		        bodyDef.position.x =  contact.x;
		        bodyDef.position.y =  contact.y;

                this.b = Physics.world.CreateBody(bodyDef).CreateFixture(fixDef).GetBody()
                var b = this.b;

             var shape = new b2PolygonShape();
                    shape.SetAsBox(0.5, 0.125);
                    

                    var fd = new b2FixtureDef();
                    fd.shape = shape;
                    fd.density = 1.0;
                    fd.friction = 0.2;
                fd.shape = new b2CircleShape(0.15);
       // fd.shape.SetLocalPosition(new b2Vec2(0, (1.0) * -1));

                    var jd = new b2RevoluteJointDef();

                var joint = new b2DistanceJointDef();
                var p1, p2, d;

                joint.frequencyHz = 40.0;
                joint.dampingRatio = 50.0;

                jd = joint;
   

                    var prevBody = b;
                    var d = b.GetPosition().Copy();
                    var wormPos = worm.body.GetPosition().Copy();
                    wormPos.Subtract(d);
                    wormPos.Normalize();

                    for (var i = 1; i < 5; ++i)
                    {
                            var bd = new b2BodyDef();
                            bd.type = b2Body.b2_dynamicBody;
                            
                            var pos = b.GetPosition().Copy();
                            var dScaled = wormPos.Copy();
                            dScaled.Multiply(0.01*i);
                            pos.Add(dScaled);
                            

                            bd.position.SetV( pos);
                        
                            var body = Physics.world.CreateBody(bd);
                            body.CreateFixture(fd);
                        body.SetFixedRotation(true);

                            //var anchor = new b2Vec2(45.0 + 1.0 * i, 5.0);
                joint.bodyA = prevBody;
                joint.bodyB = body;
                joint.localAnchorA.Set(0, 0.0);
                joint.localAnchorB.Set(0, 0.0);
                            if (i == 4)
                            {
                                 //joint.frequencyHz = 1.0;
                                joint.dampingRatio = 105.0;
                                joint.bodyB = worm.body;
                            }
                            //jd.Initialize(prevBody, body, anchor);
                            Physics.world.CreateJoint(jd);

                           
                            prevBody = body;
                    }

                   // var anchor = b.GetPosition().Copy();
                    //jd.Initialize(prevBody, b, anchor);
                    Physics.world.CreateJoint(jd);

            }
        } else
        {
           // Physics.world.DestroyJoint(this.ropeJoint);
            Physics.world.DestroyBody(this.b);
        }
        
        super.activate(worm);
    }

    draw(ctx)
    {
      
    }

}