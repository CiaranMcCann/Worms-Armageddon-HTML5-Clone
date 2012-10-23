///<reference path="Graphics.ts"/>
///<reference path="AssetManager.ts"/>
///<reference path="Physics.ts"/>

class Worm {

    body;
    fixture;
    image;

    constructor (x, y, image) {

        this.image = image;

        var fixDef = new b2FixtureDef;
        fixDef.density = 10.0;
        fixDef.friction = 50.5;
        fixDef.restitution = 0.2;
        fixDef.shape = new b2PolygonShape();
        fixDef.shape = new b2CircleShape((image.width/4)/Physics.worldScale);

        var bodyDef = new b2BodyDef;
        bodyDef.type = b2Body.b2_dynamicBody;
        bodyDef.position.x = x;
        bodyDef.position.y = y;

        this.fixture = Physics.world.CreateBody(bodyDef).CreateFixture(fixDef);
        this.body = this.fixture.GetBody();
        this.body.SetFixedRotation(true);
        this.body.SetSleepingAllowed(false);

    }

    controls(event) {

        var currentPos = new b2Vec2(this.body.GetPosition().x,this.body.GetPosition().y);

        if (event.keyCode == 37) //left
        {
            //currentPos.Normalize();
            //currentPos.Multiply(20/Physics.worldScale);
            //currentPos.Add(this.body.GetPosition())
            //console.log(" " + currentPos.x + "   " + currentPos.y);
            this.body.SetPosition(new b2Vec2(currentPos.x - 1.5/Physics.worldScale, currentPos.y) );
        }


        if (event.keyCode == 39) //right
        {
           // currentPos.Normalize();
           // currentPos.Multiply(-20/Physics.worldScale);
            //currentPos.Add(this.body.GetPosition())
           // console.log(" " + currentPos.x + "   " + currentPos.y);
            //this.body.SetPosition(currentPos);
             this.body.SetPosition(new b2Vec2(currentPos.x + 1.5/Physics.worldScale, currentPos.y) );
        }

    }

    draw(ctx) {

        ctx.save()

        ctx.translate(
        this.body.GetPosition().x * Physics.worldScale,
        this.body.GetPosition().y * Physics.worldScale
        )
    
        ctx.rotate(this.body.GetAngle())
        var radius = this.fixture.GetShape().GetRadius() * Physics.worldScale;

        ctx.drawImage(this.image,       
            0,0,this.image.width,this.image.width,
            -radius*2,
            -radius*2,
            this.image.width,
           this.image.width);
        ctx.restore()

    }

}