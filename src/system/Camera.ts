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

    panPosition;
    panSpeed;
    toPanOrNotToPan;

    constructor (levelWidth, levelHeight, vpWidth, vpHeight)
    {
        this.levelWidth = levelWidth;
        this.levelHeight = levelHeight;

        this.vpWidth = vpWidth;
        this.vpHeight = vpHeight;

        this.position = new b2Vec2(0, 0);
        this.panPosition = new b2Vec2(0, 0);

        this.panSpeed = 8;
        this.toPanOrNotToPan = false;

    }

    update()
    {
        //Logger.log("before Update this.panX = " + this.panX + "  this.x = " + this.x);
        //Logger.log("before Update this.panY = " + this.panY + "  this.y = " + this.y);

        if (this.toPanOrNotToPan)
        {
            if (this.panPosition.x >= this.position.x)
            {
                this.incrementX(this.panSpeed);
            }

            if (this.panPosition.x <= this.position.x)
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
        // Center on said position
        vector.x -= this.vpWidth / 2;
        vector.y -= this.vpHeight / 2;

        // 
        var currentPos = this.position.Copy();
        currentPos.Subtract(vector);
        var diff = currentPos.Length()/25;
        this.panSpeed = diff;
       // Logger.log(this.panSpeed);

        //if (vector.x > this.position.x + 20 || vector.x < this.position.x - 20)
        //{
            this.panPosition.x = vector.x;
            this.toPanOrNotToPan = true;
       // }

       // if (vector.y > this.position.y + 20 || vector.y < this.position.y - 20)
       // {
            this.panPosition.y = vector.y;
          //  this.toPanOrNotToPan = true;
       // }
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