/**
 * Physics
 * This namespace holes the box2d physics world and scale. It provides helper convert methods
 * to increase codebase readablity. It also mangaes the global box2d contactlistner.
 *
 *  License: Apache 2.0
 *  author:  Ciarán McCann
 *  url: http://www.ciaranmccann.me/
 */

///<reference path="../Game.ts"/>
///<reference path="Utilies.ts" />

// Throws to many errors to use
//<reference path="../../external/box2dweb-2.1.d.ts" />

declare var Box2D;
//Global defining of shortened names for box2d types
var b2Vec2 = Box2D.Common.Math.b2Vec2,
    b2BodyDef = Box2D.Dynamics.b2BodyDef,
    b2Body = Box2D.Dynamics.b2Body,
    b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
    b2Fixture = Box2D.Dynamics.b2Fixture,
    b2World = Box2D.Dynamics.b2World,
    b2MassData = Box2D.Collision.Shapes.b2MassData,
    b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
    b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
    b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
    b2AABB = Box2D.Collision.b2AABB,
    b2ContactListener = Box2D.Dynamics.b2ContactListener,
    b2RayCastInput = Box2D.Collision.b2RayCastInput,
    b2DistanceJointDef = Box2D.Dynamics.Joints.b2DistanceJointDef,
    b2RayCastOutput = Box2D.Collision.b2RayCastOutput,
    b2RevoluteJointDef =  Box2D.Dynamics.Joints.b2RevoluteJointDef,
	b2RevoluteJoint = Box2D.Dynamics.Joints.b2RevoluteJoint,
    b2SimplexVertex = Box2D.Collision.b2SimplexVertex,
    b2WorldManifold = Box2D.Collision.b2WorldManifold,
    b2Shape = Box2D.Collision.Shapes.b2Shape;



module Physics
{
 
    export var worldScale;
    export var world;
    export var debugDraw;

    // For fast acess to all bodies that aren't the terrain
    export var fastAcessList = [];
    export function addToFastAcessList(body)
    {
        fastAcessList.push(body);
    }

    export function removeToFastAcessList(body)
    {
        for (var b in fastAcessList)
        {
            if (fastAcessList[b] === body)
            {
                Utilies.deleteFromCollection(fastAcessList, b);
            }
        }
    }



    export function init(ctx)
    {
        
        Physics.worldScale = 30;

        // Creating our physics world.
        Physics.world = new b2World(
            new b2Vec2(0, 10) ,//gravity
            true //allow sleep
        );

        //Setting up debug drawing of the physics world
        debugDraw = new b2DebugDraw();
        debugDraw.SetSprite(ctx);
        debugDraw.SetDrawScale(Physics.worldScale);
        debugDraw.SetFillAlpha(0.3);
        debugDraw.SetLineThickness(1.0);
        debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit );
        world.SetDebugDraw(debugDraw);


        // This sets up the world contact listenre
        // when their is a contact we get the user data from the
        // two bodies that are in contact. In the construction of these bodies
        // I have set the this pionter as the user data, which allows me to then call methods
        // on that class as we can see below.
        var listener = new b2ContactListener();
        listener.BeginContact = function (contact) =>
        {
            if (contact.GetFixtureA().GetBody().GetUserData() != null &&
                contact.GetFixtureA().GetBody().GetUserData().beginContact != null)
            {
                contact.GetFixtureA().GetBody().GetUserData().beginContact(contact);
            } else
            {
               // Logger.warn(" Body does not have beginContact method");
            }

            if (contact.GetFixtureB().GetBody().GetUserData() != null &&
                contact.GetFixtureB().GetBody().GetUserData().beginContact != null)
            {
                contact.GetFixtureB().GetBody().GetUserData().beginContact(contact);
            } else
            {
                //Logger.warn(" Body does not have beginContact method");
            }
        }


        listener.EndContact = function (contact) =>
        {
            if (contact.GetFixtureA().GetBody().GetUserData() != null &&
                contact.GetFixtureA().GetBody().GetUserData().endContact != null)
            {
                contact.GetFixtureA().GetBody().GetUserData().endContact(contact);
            }
            else
            {
                //Logger.warn(" Body does not have endContact method");
            }

             if (contact.GetFixtureB().GetBody().GetUserData() != null &&
                 contact.GetFixtureB().GetBody().GetUserData().endContact != null)
            {
                 contact.GetFixtureB().GetBody().GetUserData().endContact(contact);
            }
            else
            {
                //Logger.warn(" Body does not have endContact method");
            }
        }

        world.SetContactListener(listener);
    }

    //Checks if the collison is between an obj of type1 and an obj of type2
    export function isCollisionBetweenTypes(objType1, objType2, contact)
    {
        var obj1 = contact.GetFixtureA().GetBody().GetUserData();
        var obj2 = contact.GetFixtureB().GetBody().GetUserData();

        if (
            (obj1 instanceof objType1 || obj1 instanceof objType2)
            &&
            (obj2 instanceof objType1 || obj2 instanceof objType2)
          )
        {
            return true;
        } else
        {
            return false;
        }
    }

    export function shotRay(p1,p2, )
    {
            var input = new b2RayCastInput();
            var output = new b2RayCastOutput();
            var intersectionPoint = new b2Vec2();
            var normalEnd = new b2Vec2();
            var intersectionNormal = new b2Vec2();

            p2.Multiply(30);
            p2.Add(p1);

            input.p1 = p1;
            input.p2 = p2;
            input.maxFraction = 1;
            var closestFraction = 1;
            var bodyFound = false;

            var b = new b2BodyDef();
            var f = new b2FixtureDef();
            for(b = Physics.world.GetBodyList(); b; b = b.GetNext())    {           
                for(f = b.GetFixtureList(); f; f = f.GetNext()) {
                    if(!f.RayCast(output, input))
                        continue;
                    else if(output.fraction < closestFraction)  {
                        closestFraction = output.fraction;
                         intersectionNormal = output.normal;
                         bodyFound = true;
                         //Logger.log("collision");
                    }
                }

            }
            intersectionPoint.x = p1.x + closestFraction * (p2.x - p1.x);
            intersectionPoint.y = p1.y + closestFraction * (p2.y - p1.y);

            if (bodyFound)
            {
                return intersectionPoint;
            }

            return null;
    }

    export function applyToNearByObjects(epicenter,effectedRadius,funcToApplyToEach)
    {
        var aabb = new b2AABB();
        aabb.lowerBound.Set(epicenter.x - effectedRadius, epicenter.y - effectedRadius);
        aabb.upperBound.Set(epicenter.x + effectedRadius, epicenter.y + effectedRadius);

        Physics.world.QueryAABB(function (fixture) =>
        {
            funcToApplyToEach(fixture,epicenter);           
            return true;

        }, aabb);
    }

    //Converts pixels to physic world measurement
    export function pixelToMeters(pixels: number)
    {
        return pixels / worldScale;
    }

    //Converts physic world measurement to pixels;
    export function metersToPixels(meters: number)
    {
        return meters * worldScale;
    }

     //Converts a vector in pixels to physic world measurement
    export function vectorPixelToMeters(vPixels)
    {
        return new b2Vec2(vPixels.x / worldScale, vPixels.y / worldScale);
    }

    //Converts a vector in physic world measurement to pixels;
    export function vectorMetersToPixels(vMeters)
    {
        return new b2Vec2(vMeters.x * worldScale,vMeters.y * worldScale);
    }

    export function bodyToDrawingPixelCoordinates(body)
    {
        var pos = body.GetPosition();
        var radius = body.GetFixtureList().GetShape().GetRadius();

        pos.x -= radius;
        pos.y -= radius;

        return Physics.vectorMetersToPixels(pos);
        
    }
}


class BodyDataPacket
{

    pX;
    pY;

    constructor(body)
    {
        if (typeof body == "string")
        {
            this.fromJSON(body);
        } else
        {
            this.pX = body.GetPosition().x;
            this.pY = body.GetPosition().y;
        }
    }

    override(body)
    {
        body.SetPosition(new b2Vec2(this.pX, this.pY));
    }

    toJSON()
    {
        return (Math.floor(this.pX * 1000) / 1000) + "," + (Math.floor(this.pY * 1000) / 1000);
        //this.pX + "," +this.pY
    }

    fromJSON(data :string)
    {
        var v = data.split(",");
        this.pX = parseFloat(v[0]);
        this.pY = parseFloat(v[1]);
    }
}


class PhysiscsDataPacket
{
    bodyDataPackets: BodyDataPacket[];


    constructor(bodies)
    {
        this.bodyDataPackets = [];

        if (typeof bodies == "string")
        {
            this.fromJSON(bodies);
        } else
        {
            for (var b in bodies)
            {
                this.bodyDataPackets.push(new BodyDataPacket(bodies[b]));
            }
        }
    }

    override(bodies)
    {
        for (var b in this.bodyDataPackets)
        {
            this.bodyDataPackets[b].override(bodies[b]);
        }
    }

    toJSON()
    {
        var data = "";
        for (var b in this.bodyDataPackets)
        {
            data += this.bodyDataPackets[b].toJSON()+":"
        }

        return data;
    }

    fromJSON(data :string)
    {
        var vectors = data.split(":");
        for (var i in vectors)
        {
            if (vectors[i] != "")
            {
                this.bodyDataPackets.push(new BodyDataPacket(vectors[i]));
            }
        }

    }
}