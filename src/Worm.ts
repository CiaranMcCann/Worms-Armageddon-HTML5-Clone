///<reference path="Graphics.ts"/>
///<reference path="AssetManager.ts"/>
///<reference path="Physics.ts"/>
///<reference path="animation/Sprite.ts"/>

class Worm extends Sprite
{

    body;
    fixture;
    image;
    direction;
    sprite;
    speed;

    constructor (x, y)
    {
        super(Sprites.worms.walkingRight);

        var fixDef = new b2FixtureDef;
        fixDef.density = 1.0;
        fixDef.friction = 5.5;
        fixDef.restitution = 0.3;
        fixDef.shape = new b2PolygonShape();
        fixDef.shape = new b2CircleShape((AssetManager.images[this.spriteDef.imageName].width / 2) / Physics.worldScale);

        var bodyDef = new b2BodyDef;
        bodyDef.type = b2Body.b2_dynamicBody;
        bodyDef.position.x = x;
        bodyDef.position.y = y;

        this.fixture = Physics.world.CreateBody(bodyDef).CreateFixture(fixDef);
        this.body = this.fixture.GetBody();
        this.body.SetFixedRotation(true);
        this.body.SetSleepingAllowed(false);
        this.direction = 1
        this.speed = 0.5;

    }

    update()
    {

        var currentPos = new b2Vec2(this.body.GetPosition().x, this.body.GetPosition().y);

        if (keyboard.isKeyDown(65)) //left
        {
            super.setSpriteDef(Sprites.worms.walkingLeft);        
            super.update();
            this.body.SetPosition(new b2Vec2(currentPos.x - this.speed / Physics.worldScale, currentPos.y));
            //this.body.SetLinearVelocity(new b2Vec2(-5,0));
            this.direction = -1;

            if (AssetManager.sounds["WalkExpand"].isPlaying() == false )
            {
                    if (super.getCurrentFrame() % 5 == 0)
                    {
                        AssetManager.sounds["WalkCompress"].play();
                    } else
                    {
                        AssetManager.sounds["WalkExpand"].play();
                    }
            }
                
        }

        if (keyboard.isKeyDown(87)) //jumpaa
        {
            if (this.body.GetLinearVelocity().y == 0)
            {
                var forces = new b2Vec2(this.direction * 2, 1);
                forces.Multiply(15);
                this.body.SetLinearVelocity(forces);
                // this.body.ApplyImpulse(forces, this.body.GetPosition());
            }

         
        }

        if (keyboard.isKeyDown(68)) //right
        {
            super.setSpriteDef(Sprites.worms.walkingRight);
            super.update();

            this.body.SetPosition(new b2Vec2(currentPos.x + this.speed / Physics.worldScale, currentPos.y));
            this.direction = 1;  
        }


    }

    draw(ctx)
    {

        ctx.save()

        ctx.translate(
        this.body.GetPosition().x * Physics.worldScale,
        this.body.GetPosition().y * Physics.worldScale
        )

        ctx.rotate(this.body.GetAngle())
        var radius = this.fixture.GetShape().GetRadius() * Physics.worldScale;

        super.draw(ctx,
            -radius*0.8,
            -radius*0.8);
        ctx.restore()

    }

}