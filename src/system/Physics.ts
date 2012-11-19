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

//TODO convert to a singlteon 
module Physics {

    export var worldScale;
    export var world;
    export var debugDraw;
    export var contactFunctionsList = [];

    export function init(ctx) {

        Physics.worldScale = 30;

        // Creating our physics world.
        Physics.world = new b2World(
            new b2Vec2(0, 10) //gravity
            ,
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
    }

    //Allows for easy callback functions when their is a collision
    // between two objects.
    export function addContactListener(func) {
        contactFunctionsList.push(func);
        var listener = new b2ContactListener();

        // called when two objects start touching
        var removalList = [];
        listener.BeginContact = function (contact) {
            
            var lenght = contactFunctionsList.length;
            for (var i = 0; i < lenght; i++) {

                //call all the functions that have registered as listens
                var removefunc = contactFunctionsList[i](contact);

                // If a listener function returned true, it has wishs to be unregistered 
                if (removefunc) {
                    removalList.push(i);
                }
            }

            for (var i = 0; i < removalList.length; i++) {
                Utilies.deleteFromCollection(contactFunctionsList, removalList[i]);
            }
            removalList = []; // clean up
        }
    
	   world.SetContactListener(listener); 
    }


    export function isObjectColliding(userData1, userData2 ,contact)
    {
            var UserDataA = contact.GetFixtureA().GetBody().GetUserData();
            var UserDataB = contact.GetFixtureB().GetBody().GetUserData();

            if (
                (UserDataA == userData1 || UserDataB == userData1) 
                && 
                (UserDataB == userData2 || UserDataA == userData2 )
            ) {
                return true;
            }else{
                return false;
            }

    }

    //Converts pixels to physic world measurement
    export function pixelToMeters(pixels: number) {
        return pixels / worldScale;
    }

    //Converts physic world measurement to pixels;
    export function metersToPixels(meters: number) {
        return meters * worldScale;
    }

}