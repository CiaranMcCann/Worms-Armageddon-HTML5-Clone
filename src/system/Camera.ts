class Camera
{

    x;
    y;
    levelWidth;
    levelHeight;
    vpWidth;
    vpHeight;

    constructor (levelWidth, levelHeight, vpWidth, vpHeight)
    {
        this.levelWidth = levelWidth;
        this.levelHeight = levelHeight;

        this.vpWidth = vpWidth;
        this.vpHeight = vpHeight;

        this.x = 0;
        this.y = 0;

    }

    getX() { return this.x; }
    getY() { return this.y; }

    setX(x: number)
    {
        if (x > this.vpWidth/2)
        {
            x = (x - this.vpWidth / 2);
            if (this.vpWidth + x <= this.levelWidth && x >= 0)
            {
                this.x = x;
            }
        }
    }

    setY(y: number)
    {
       // if (y > this.vpHeight / 2)
        //{
            //y = (y - this.vpHeight / 4);
            if (this.vpHeight + y <= this.levelHeight && y >= 0)
            {
                this.y = y;
            }
       // }
    }

    incrementX( x : number)
    {
        this.setX(this.x + x);
    }

    incrementY( y : number)
    {
        this.setY(this.y + y);
    }

}