///<reference path="Graphics.ts"/>
///<reference path="AssetManager.ts"/>
///<reference path="Physics.ts"/>

class Worm {

    body;
    fixture;
    image;
    direction;

    constructor (x, y, image) {

        this.image = image;

        var fixDef = new b2FixtureDef;
        fixDef.density = 10.0;
        fixDef.friction = 50.5;
        fixDef.restitution = 0.3;
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
        this.direction = 1;

    }

    controls() {

        var currentPos = new b2Vec2(this.body.GetPosition().x,this.body.GetPosition().y);

        if (keyboard.isKeyDown(65)) //left
        {
            this.body.SetPosition(new b2Vec2(currentPos.x - 1/Physics.worldScale, currentPos.y) );
            this.direction = -1;
        }

        if (keyboard.isKeyDown(87)) //jump
        {
            if (this.body.GetLinearVelocity().y <= 0) {
                this.body.SetLinearVelocity(new b2Vec2(20*this.direction,20));
            }
        }

        if (keyboard.isKeyDown(68)) //right
        {
             this.body.SetPosition(new b2Vec2(currentPos.x + 1/Physics.worldScale, currentPos.y) );
             this.direction = 1;
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