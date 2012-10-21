///<reference path="Graphics.ts"/>
///<reference path="AssetManager.ts"/>
///<reference path="Physics.ts"/>
///<reference path="Terrain.ts"/>


class Game {

    canvas;
    ctx;
    terrain;

    constructor () {
        Graphics.init();
        this.init();
    }

    init() {

        this.canvas = Graphics.createCanvas();
        this.ctx = this.canvas.getContext("2d");

        Physics.init(this.ctx);
        this.terrain = new Terrain(this.canvas, AssetManager.images.background, Physics.world, Physics.worldScale);

        this.canvas.addEventListener("click", function (evt) =>
        {
            this.terrain.deformRegion(evt.pageX, evt.pageY, 40)

        }, false);

       // Demo objects falling
       var fixDef = new b2FixtureDef;
       fixDef.density = 1.0;
       fixDef.friction = 0.5;
       fixDef.restitution = 0.2;
     
       var bodyDef = new b2BodyDef;
       //bodyDef.type = b2Body.b2_staticBody;
       fixDef.shape = new b2PolygonShape;

       bodyDef.type = b2Body.b2_dynamicBody;
       for(var i = 0; i < 5; ++i) {
          if(Math.random() > 0.5) {
             fixDef.shape = new b2PolygonShape;
             fixDef.shape.SetAsBox(
                   Math.random() + 0.5 //half width
                ,  Math.random() + 0.5 //half height
             );
          } else {
             fixDef.shape = new b2CircleShape(
                Math.random() + 0.5 //radius
             );
          }
          bodyDef.position.x = Math.random() * 20;
          bodyDef.position.y = Math.random() * -10;
          Physics.world.CreateBody(bodyDef).CreateFixture(fixDef);
       }
    }

    update() {


    }

    step() {

        Physics.world.Step(
              (1 / 60)   
           , 10       //velocity iterations
           , 10       //position iterations
        );
        Physics.world.DrawDebugData();
        Physics.world.ClearForces();

    }

    draw() {
        //this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.terrain.draw(this.ctx);
    }

}