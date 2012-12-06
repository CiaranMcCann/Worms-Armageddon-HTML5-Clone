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

    x;
    y;
    levelWidth;
    levelHeight;
    vpWidth;
    vpHeight;
    panX;
    panY;
    panSpeed;
    toPanOrNotToPan;

    constructor (levelWidth, levelHeight, vpWidth, vpHeight)
    {
        this.levelWidth = levelWidth;
        this.levelHeight = levelHeight;

        this.vpWidth = vpWidth;
        this.vpHeight = vpHeight;

        this.x = 0;
        this.y = 0;
        this.panX = 0;
        this.panY = 0;
        this.panSpeed = 8;
        this.toPanOrNotToPan = false;

    }

    update()
    {
        //Logger.log("before Update this.panX = " + this.panX + "  this.x = " + this.x);
        //Logger.log("before Update this.panY = " + this.panY + "  this.y = " + this.y);

        if (this.toPanOrNotToPan)
        {
            if (this.panX >= this.x)
            {
                this.incrementX(this.panSpeed);
            }

            if (this.panX <= this.x)
            {
                this.incrementX(-this.panSpeed);
            }

            if (this.panY > this.y)
            {
                this.incrementY(this.panSpeed);
              
            }

            if (this.panY < this.y)
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
        this.panToX(vector.x - this.vpWidth/2);
        this.panToY(vector.y - this.vpHeight/2 );
    }

    panToX(x: number)
    {
        if (x > this.x + 50 || x < this.x - 50)
        {
            this.panX = x;
            this.toPanOrNotToPan = true;
        }
    }

    panToY(y: number)
    {
        if (y > this.y + 50 || y < this.y - 50)
        {
            this.panY = y;
            this.toPanOrNotToPan = true;
        }
    }

    getX() { return this.x; }
    getY() { return this.y; }

    setX(x: number)
    {
        if (this.vpWidth + x <= this.levelWidth && x >= 0)
        {
            this.x = x;
            return true;
        }
      return false;
    }

    setY(y: number)
    {
        if (this.vpHeight + y <= this.levelHeight && y >= 0)
        {
            this.y = y;
            return true;
        }

        return false;
    }

    incrementX(x: number)
    {
       return this.setX(this.x + x);
    }

    incrementY(y: number)
    {
       return this.setY(this.y + y);
    }

}