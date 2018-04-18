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


//TODO Needs to be clean up, after I hacked it to be more generic 
// for just displaying messages, demo 2moro not enough time to clean it up. More features!!!
class ToostMessage
{
    finished;
    color;
    pos;
    message;
    box;
    speed;

    timer: Timer;
    onFinishFunc;


    // pre-render box around countdown number
    preRenderNumberBox()
    {
        var healthBoxWidth = 39;
        var healthBoxHeight = 18
        return Graphics.preRenderer.render(function (ctx)
        {

            ctx.fillStyle = '#1A1110';
            ctx.strokeStyle = "#eee";

            Graphics.roundRect(ctx, 0, 0, healthBoxWidth, healthBoxHeight, 4).fill();
            Graphics.roundRect(ctx, 0, 0, healthBoxWidth, healthBoxHeight, 4).stroke();
        }, 39, 20);

    }

    preRenderMessageBox()
    {
        var nameBoxWidth = this.message.length * 10;
        return Graphics.preRenderer.render(function (ctx)
        {

            ctx.fillStyle = '#1A1110';
            ctx.strokeStyle = "#eee";
            ctx.font = 'bold 16.5px Sans-Serif';
            ctx.textAlign = 'center';

            Graphics.roundRect(ctx, 0, 0, nameBoxWidth, 20, 4).fill();
            Graphics.roundRect(ctx, 0, 0, nameBoxWidth, 20, 4).stroke();

            ctx.fillStyle = this.color;
            ctx.fillText(this.message, (this.message.length * 10) / 2, 15);

        }, nameBoxWidth, 20);
    }


    constructor (pos, message, color, time = 2700, speed = 0.7)
    {
        this.finished = false;
        this.color = color;
        this.pos = pos;
        this.message = message;
        this.speed = speed;


        if (Utilies.isNumber(this.message))
        {
            this.message = Math.floor(this.message);
            this.box = this.preRenderNumberBox();
        } else
        {
            this.box = this.preRenderMessageBox();
        }

        this.pos.x -= this.box.width/2;
        this.pos.y -= this.box.height*2;

        this.timer = new Timer(time);
    }

    draw(ctx)
    {
        ctx.drawImage(this.box, this.pos.x, this.pos.y);
        ctx.fillStyle = this.color;

        if (Utilies.isNumber(this.message))
        {
            ctx.fillText(this.message, this.pos.x + (this.box.width / 2), this.pos.y + (this.box.height / 1.4));
        }
    }

    onAnimationFinish(func)
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

        this.pos.y -= this.speed;
    }



}