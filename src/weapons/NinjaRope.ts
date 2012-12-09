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
        super.activate(worm);

         if (this.getIsActive())
       {

            var dir = this.worm.target.getTargetDirection().Copy();
            dir.Multiply(20);
            var contact = Physics.shotRay(this.worm.body.GetPosition(),dir);

            if (contact)
            {

                var fixDef = new b2FixtureDef;
                fixDef.density = 1.0;
                fixDef.friction = 1.0;
                fixDef.restitution = 0.0;
                fixDef.shape = new b2PolygonShape;

                var bodyDef = new b2BodyDef;
                bodyDef.type = b2Body.b2_staticBody;

		        fixDef.shape.SetAsBox(Physics.pixelToMeters(30/2),Physics.pixelToMeters(30/2));

		        bodyDef.position.x =  contact.x;
		        bodyDef.position.y =  contact.y;

                var b = Physics.world.CreateBody(bodyDef).CreateFixture(fixDef).GetBody();

                var joint = new b2DistanceJointDef();
                var p1, p2, d;

                joint.frequencyHz = 2.0;
                joint.dampingRatio = 10.0;

                joint.bodyA = b;
                joint.bodyB = this.worm.body;
                joint.localAnchorA.Set(0, 0.0);
                joint.localAnchorB.Set(0, 0.0);
                Physics.world.CreateJoint(joint)
               
            }
       }
        
    }

    draw(ctx)
    {
      
    }

}