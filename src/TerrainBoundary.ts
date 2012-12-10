/**
 * WorldBoundary.js
 *
 *  License: Apache 2.0
 *  author:  Ciarán McCann
 *  url: http://www.ciaranmccann.me/
 */
///<reference path="system/Physics.ts"/>
///<reference path="system/Utilies.ts" />

class TerrainBoundary
{
    worldWidth;
    worldHeight;
    
    constructor (worldWidth,worldHeight)
    {
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;


        //Bottom
        var fixDef = new b2FixtureDef;
        fixDef.density = 1.0;
        fixDef.friction = 1.0;
        fixDef.restitution = 0.0;
        fixDef.shape = new b2PolygonShape;
        fixDef.shape.SetAsBox( Physics.pixelToMeters(worldWidth), 0.5);

       var bodyDef = new b2BodyDef;
       bodyDef.type = b2Body.b2_staticBody;             
       bodyDef.position.x = 0;
       bodyDef.position.y = Physics.pixelToMeters(worldHeight);

       var bottom = Physics.world.CreateBody(bodyDef).CreateFixture(fixDef).GetBody();
       bottom.SetUserData(this);

       var topPositionY = Physics.pixelToMeters(worldHeight / 4);
       var topPositionY = Physics.pixelToMeters(worldHeight / 4);
        
        // Top 
       bodyDef.position.x = 0;
       bodyDef.position.y = -topPositionY;
       fixDef.shape.SetAsBox( Physics.pixelToMeters(worldWidth), 0.5);

       var body = Physics.world.CreateBody(bodyDef).CreateFixture(fixDef).GetBody();
       body.SetUserData(null);


       // left 
       bodyDef.position.x = 0;
       bodyDef.position.y = -topPositionY;
       fixDef.shape.SetAsBox( 0.5,  Physics.pixelToMeters(worldHeight)+topPositionY);

       body = Physics.world.CreateBody(bodyDef).CreateFixture(fixDef).GetBody();


        // right
       bodyDef.position.x = Physics.pixelToMeters(worldWidth);
       bodyDef.position.y = -topPositionY;
       fixDef.shape.SetAsBox( 0.5,  Physics.pixelToMeters(worldHeight)+topPositionY);

       body = Physics.world.CreateBody(bodyDef).CreateFixture(fixDef).GetBody();


    }


       // What happens when a worm collies with another object
    beginContact(contact)
    {
        var obj1 = contact.GetFixtureA().GetBody().GetUserData();
        var obj2 = contact.GetFixtureB().GetBody().GetUserData();

        if (obj1 instanceof Worm)
        {
            obj1.hit(obj1.getHealth()*-1.0);

        }else if (obj2 instanceof Worm)
        {
            obj2.hit(obj2.getHealth());
        }
    }

 
}