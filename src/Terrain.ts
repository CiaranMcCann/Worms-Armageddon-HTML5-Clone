///<reference path="Physics.ts"/>


class Terrain {

    canvas: HTMLCanvasElement;
    bufferCanvas: HTMLCanvasElement;
    bufferCanvasContext: CanvasRenderingContext2D;
    world;
    scale;
    groundbodiesList;
    terrainData;

    constructor (canvas, terrainImage, world, scale) {

        this.world = world;
        this.scale = world;
        this.groundbodiesList = []; //Used to easly delete all the ground bodies
        this.canvas = canvas;

        //Used for increased preformance. Its more effectent to draw one canvas onto another
        //instead of a large pixel buffer array 
        this.bufferCanvas = document.createElement('canvas');
        this.bufferCanvas.width = canvas.width;
        this.bufferCanvas.height = canvas.height;

        this.bufferCanvasContext = this.bufferCanvas.getContext('2d');
        this.bufferCanvasContext.fillStyle = 'rgba(0,0,0,255)'; //Setup alpha colour for cutting out terrain
        this.bufferCanvasContext.drawImage(terrainImage, 0, 0, this.bufferCanvas.width, this.bufferCanvas.height);

        this.terrainData = this.bufferCanvasContext.getImageData(0, 0, this.bufferCanvas.width, this.bufferCanvas.height);
        this.createTerrainPhysics(0, 0, canvas.width, canvas.height, this.terrainData.data, world, scale)
    }

    // This setup physical bodies from image data 
    createTerrainPhysics(x, y, width, height, data, world, worldScale) {

        width = width * 4;
        height = height;

        var theAlphaByte = 3;
        var rectWidth;
        var rectheight = 4;

        var fixDef = new b2FixtureDef;
        fixDef.density = 1.0;
        fixDef.friction = 0.5;
        fixDef.restitution = 0.2;
        fixDef.shape = new b2PolygonShape;

        var bodyDef = new b2BodyDef;
        bodyDef.type = b2Body.b2_staticBody;

        var bodiesCreated = 0;

        // Used to create a single rect out of a series of consecnative solid 
        var makeBlock = function () => {

             fixDef.shape.SetAsBox((rectWidth / worldScale) / 2, (rectheight / worldScale) / 2);
             bodyDef.position.x = ((xPos / 4) - (rectWidth / 2)) / worldScale;
             bodyDef.position.y = ((yPos - rectheight) / worldScale);
             this.groundbodiesList.push(world.CreateBody(bodyDef).CreateFixture(fixDef).GetBody());

        }

        //Loops though the image pixel data, looking
        // for constecative NON-alpha pixels. To create the physical blocks out of
        for (var yPos = y; yPos <= height; yPos += rectheight) {
            rectWidth = 0;

            for (var xPos = x; xPos <= width; xPos += 4) {

                if (data[xPos + (yPos * width) + theAlphaByte] == 255) //if not alpha pixel
                {
                    rectWidth++; 
                    
                    if (rectWidth >= this.canvas.width) {
                        makeBlock();
                        rectWidth = 0; //reset rect
                    }

                }
                else if (rectWidth > 1) {
            
                    makeBlock();
                    bodiesCreated++;
                    rectWidth = 0; //reset rect

                }
            }
        }
        console.log("Current body count " + bodiesCreated);
    }

    // Still allows the terrain image data to be changed.
    // It then calls for the box2d physic terrain to be reconstructed from the new image
    deformRegion(x, y, radius) {

        this.bufferCanvasContext.globalCompositeOperation = "destination-out";
        this.bufferCanvasContext.putImageData(this.terrainData, 0, 0);
        this.bufferCanvasContext.beginPath();
        this.bufferCanvasContext.arc(x, y, radius, Math.PI * 2, 0, true);
        this.bufferCanvasContext.closePath();
        this.bufferCanvasContext.fill();
        this.terrainData = this.bufferCanvasContext.getImageData(0, 0, this.bufferCanvas.width, this.bufferCanvas.height);
        this.bufferCanvasContext.globalCompositeOperation = "source-over";

        for (var body in this.groundbodiesList) {
            this.world.DestroyBody(this.groundbodiesList[body]);
        }

        this.createTerrainPhysics(0, 0, this.bufferCanvas.width, this.bufferCanvas.height, this.terrainData.data, this.physics.world, this.physics.SCALE)
    }

    draw(canvasContextWhichToDrawOn) {
        canvasContextWhichToDrawOn.drawImage(this.bufferCanvas, 0, -5);
    };


}