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
        this.panSpeed = 12;

    }

    update()
    {
        //Logger.log("before Update this.panX = " + this.panX + "  this.x = " + this.x);
        //Logger.log("before Update this.panY = " + this.panY + "  this.y = " + this.y);

        if (this.panX > this.x)
        {
            this.incrementX(this.panSpeed);
        }
        
        if (this.panX < this.x)
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

       // Logger.log("after Update this.panX = " + this.panX + "  this.x = " + this.x);
       //Logger.log("after Update this.panY = " + this.panY + "  this.y = " + this.y);

    }

    panToX(x: number)
    {
        if (x > (this.vpWidth / 2)-this.x && x > this.x)
        {
            this.panX = x;
        }
        else if (x < this.x)
        {
            this.panX = x;
        }
    }

    panToY(y: number)
    {
        if (y > (this.vpHeight / 2)-this.y && y > this.y)
        {
            this.panY = y;
        }
        else if (y < this.y)
        {
            this.panY = y;
        }
    }

    getX() { return this.x; }
    getY() { return this.y; }

    setX(x: number)
    {
        if (this.vpWidth + x <= this.levelWidth && x >= 0)
        {
            this.x = x;
        }
    }

    setY(y: number)
    {
        if (this.vpHeight + y <= this.levelHeight && y >= 0)
        {
            this.y = y;
        }
    }

    incrementX(x: number)
    {
        this.setX(this.x + x);
    }

    incrementY(y: number)
    {
        this.setY(this.y + y);
    }

}