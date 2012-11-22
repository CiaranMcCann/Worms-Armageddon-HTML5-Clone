/**
 * Physics
 * This namespace wholes the physics world and scale. It provides helper convert methods
 * to increase codebase readablity. It also mangaes the global box2d contactlistner.
 *
 *  License: Apache 2.0
 *  author:  Ciarán McCann
 *  url: http://www.ciaranmccann.me/
 */

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
    b2ContactListener = Box2D.Dynamics.b2ContactListener;


module Physics
{

    export var worldScale;
    export var world;
    export var debugDraw;
    export var contactFunctionsList = [];

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
        debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
        world.SetDebugDraw(debugDraw);


        // This sets up the world contact listenre
        // when their is a contact we get the user data from the
        // two bodies that are in contact. In the construction of these bodies
        // I have set the this pionter as the user data, which allows me to then call methods
        // on that class as we can see below.
        var listener = new b2ContactListener();
        listener.BeginContact = function (contact) =>
        {
            if (contact.GetFixtureA().GetBody().GetUserData().beginContact != null)
            {
                 contact.GetFixtureA().GetBody().GetUserData().beginContact(contact);
            }

             if (contact.GetFixtureB().GetBody().GetUserData().beginContact != null)
            {
                 contact.GetFixtureB().GetBody().GetUserData().beginContact(contact);
            }
        }


        listener.EndContact = function (contact) =>
        {
            if (contact.GetFixtureA().GetBody().GetUserData().endContact != null)
            {
                 contact.GetFixtureA().GetBody().GetUserData().endContact(contact);
            }

             if (contact.GetFixtureB().GetBody().GetUserData().endContact != null)
            {
                 contact.GetFixtureB().GetBody().GetUserData().endContact(contact);
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

}