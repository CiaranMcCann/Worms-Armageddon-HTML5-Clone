/**
 * Camera.js
 * This controls the viewport
 *
 *  License: Apache 2.0
 *  author:  Ciarán McCann
 *  url: http://www.ciaranmccann.me/
 */
///<reference path="Utilies.ts"/>

class Camera
{

    position;
    levelWidth;
    levelHeight;
    vpWidth;
    vpHeight;
    vpX;
    vpY;

    panPosition;
    panSpeed;
    toPanOrNotToPan;

    constructor (levelWidth, levelHeight, vpWidth, vpHeight, vpX = -500, vpY = -200)
    {
        this.levelWidth = levelWidth;
        this.levelHeight = levelHeight;

        this.vpWidth = vpWidth;
        this.vpHeight = vpHeight;

        this.position = new b2Vec2(vpX, vpY);
        this.panPosition = new b2Vec2(vpX, vpY);

        this.panSpeed = 6.1;
        this.toPanOrNotToPan = false;

    }

    update()
    {
        //Logger.log("before Update this.panX = " + this.panX + "  this.x = " + this.x);
        //Logger.log("before Update this.panY = " + this.panY + "  this.y = " + this.y);

        if (this.toPanOrNotToPan)
        {
            if (this.panPosition.x > this.position.x)
            {
                this.incrementX(this.panSpeed);
            }

            if (this.panPosition.x < this.position.x)
            {
                this.incrementX(-this.panSpeed);
            }

            if (this.panPosition.y > this.position.y)
            {
                this.incrementY(this.panSpeed);

            }

            if (this.panPosition.y < this.position.y)
            {
                this.incrementY(-this.panSpeed);
            }
        }


        // Logger.log("after Update this.panX = " + this.panX + "  this.x = " + this.x);
        //Logger.log("after Update this.panY = " + this.panY + "  this.y = " + this.y);

    }

    cancelPan()
    {
        this.toPanOrNotToPan = false;
    }

 
    panToPosition(vector)
    {
        //var currentCamPos = this.position.Copy();
       // currentCamPos.Subtract(vector);

            // Center on said position
            vector.x -= this.vpWidth / 2;
            vector.y -= this.vpHeight / 2;

            var currentPos = this.position.Copy();
            currentPos.Subtract(vector);
            var diff = currentPos.Length() / 25;
            this.panSpeed = diff;

            this.panPosition.x = vector.x;
            this.toPanOrNotToPan = true;

            this.panPosition.y = vector.y;
        
    }

    getX() { return this.position.x; }
    getY() { return this.position.y; }

    setX(x: number)
    {
        if (this.vpWidth + x <= this.levelWidth && x >= 0)
        {
            this.position.x = x;
            return true;
        }
        return false;
    }

    setY(y: number)
    {
        if (this.vpHeight + y <= this.levelHeight && y >= 0)
        {
            this.position.y = y;
            return true;
        }

        return false;
    }

    incrementX(x: number)
    {
        return this.setX(this.position.x + x);
    }

    incrementY(y: number)
    {
        return this.setY(this.position.y + y);
    }

}