/**
 * HealthReduction.js
 *
 *  License: Apache 2.0
 *  author:  Ciarán McCann
 *  url: http://www.ciaranmccann.me/
 */
///<reference path="Sprite.ts"/>
///<reference path="SpriteDefinitions.ts"/>
///<reference path="../system/AssetManager.ts"/>
///<reference path="../system/Utilies.ts"/>
///<reference path="../system/Timer.ts" />
///<reference path="../Settings.ts" />
///<reference path="../system/Physics.ts" />

class HealthReduction
{
    finished;
    color;
    pos;
    health;

    timer: Timer;
    onFinishFunc;


    // pre-render box around countdown number
    static preRender()
    {
        var healthBoxWidth = 39;
        var healthBoxHeight = 18
        return Graphics.preRenderer.render(function (ctx) =>
        {

            ctx.fillStyle = '#1A1110';
            ctx.strokeStyle = "#eee";

            Graphics.roundRect(ctx, 0, 0, healthBoxWidth, healthBoxHeight, 4).fill();
            Graphics.roundRect(ctx, 0, 0, healthBoxWidth, healthBoxHeight, 4).stroke();


        }, 39, 20);

    }
    static numberBox = HealthReduction.preRender();

    constructor (pos, health: number, color)
    {
        this.finished = false;
        this.health = health;
        this.color = color;
        this.pos = pos;

        this.pos.x -= HealthReduction.numberBox.width/2;
        this.pos.y -= HealthReduction.numberBox.height*2;

        this.timer = new Timer(4000);
    }

    draw(ctx)
    {

        ctx.drawImage(HealthReduction.numberBox, this.pos.x, this.pos.y);
        ctx.fillStyle = this.color;
        ctx.fillText(Math.floor(this.health), this.pos.x+(HealthReduction.numberBox.width/2), this.pos.y+(HealthReduction.numberBox.height/1.4));
    }

    onFinishAnimation(func)
    {
        this.onFinishFunc = func;
    }

    update()
    {
        this.timer.update();

        if (this.timer.hasTimePeriodPassed())
        {
            this.finished = true;
            
            if (this.onFinishFunc)
            {
                this.onFinishFunc();
            }
        }

        this.pos.y -= 0.8;
    }



}