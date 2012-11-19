///<reference path="system/Graphics.ts"/>
///<reference path="system/AssetManager.ts"/>
///<reference path="system/Physics.ts"/>
///<reference path="animation/Sprite.ts"/>
var DIRECTION = {
    left: -1,
    right: 1
}

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
        super(Sprites.worms.walking);

        var fixDef = new b2FixtureDef;
        fixDef.density = 1.0;
        fixDef.friction = 5.5;
        fixDef.restitution = 0.0;
        fixDef.shape = new b2PolygonShape();
        fixDef.shape = new b2CircleShape((AssetManager.images[this.spriteDef.imageName].width / 2.5) / Physics.worldScale);

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

    walkLeft()
    {
        var currentPos = this.body.GetPosition();
        
        this.direction = DIRECTION.left;
         if (Sprites.worms.falling != this.spriteDef)
        {
            super.setSpriteDef(Sprites.worms.walking);
        }
        
        super.update();
        this.body.SetPosition(new b2Vec2(currentPos.x - this.speed / Physics.worldScale, currentPos.y));
        //this.body.SetLinearVelocity(new b2Vec2(-5,0));
        

        if (AssetManager.sounds["WalkExpand"].isPlaying() == false)
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

    jump()
    {
        if (this.body.GetLinearVelocity().y == 0)
        {
            var forces = new b2Vec2(this.direction * 2, 1);
            forces.Multiply(15);
            this.body.SetLinearVelocity(forces);
            // this.body.ApplyImpulse(forces, this.body.GetPosition());
        }
    }

    walkRight()
    {
        var currentPos = this.body.GetPosition();
        this.direction = DIRECTION.right;
        
        if (Sprites.worms.falling != this.spriteDef)
        {
            super.setSpriteDef(Sprites.worms.walking);
        }
        
        super.update();

        this.body.SetPosition(new b2Vec2(currentPos.x + this.speed / Physics.worldScale, currentPos.y));
        
    }

    update()
    {
        // While velcoity is -1 or less worm is falling so use falling animation
        if (-this.body.GetLinearVelocity().y > 1)
        {
            super.setSpriteDef(Sprites.worms.falling);
            super.update();

            //console.log(" Current y " + this.body.GetLinearVelocity().y + "  " + this.spriteDef.imageName);
        } else if(this.body.GetLinearVelocity().y >= 0 && this.body.GetLinearVelocity().x >= 0)
        {
            super.setSpriteDef(Sprites.worms.walking);
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

     
        if (this.direction == DIRECTION.right)
        {
            // Used to flip the sprites
            ctx.translate(radius, 0);
            ctx.scale(-1, 1);
        }
        
        super.draw(ctx,
            -radius * 0.8,
            -radius);
        ctx.restore()

    }

}