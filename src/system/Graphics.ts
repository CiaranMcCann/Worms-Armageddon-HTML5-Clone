/**
 * Graphics.js
 * Graphics namespace provides helper functions for creating a canvas 
 * it also setup the request animation frame shim and the stats.js fps counter
 * 
 *  License: Apache 2.0
 *  author:  Ciarán McCann
 *  url: http://www.ciaranmccann.me/
 */
declare var Stats;

module Graphics
{

    export var stats;
    export function init()
    {

        stats = new Stats();

        // Align top-left
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';

        document.body.appendChild(stats.domElement);

        // requestAnim shim layer by Paul Irish
        window.requestAnimationFrame = (function ()
        {
            return window.requestAnimationFrame || 
                (<any>window).webkitRequestAnimationFrame || 
                (<any>window).mozRequestAnimationFrame || 
                (<any>window).oRequestAnimationFrame || 
                window.msRequestAnimationFrame ||
            function ( /* function */ callback, /* DOMElement */ element)
            {
                window.setTimeout(callback, 1000 / 60);
            };

        })();

        // may be useful in the furture for drawing rounded conor boxes for over the players head
        //CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r)
        //{
        //    if (w < 2 * r) r = w / 2;
        //    if (h < 2 * r) r = h / 2;
        //    this.beginPath();
        //    this.moveTo(x + r, y);
        //    this.arcTo(x + w, y, x + w, y + h, r);
        //    this.arcTo(x + w, y + h, x, y + h, r);
        //    this.arcTo(x, y + h, x, y, r);
        //    this.arcTo(x, y, x + w, y, r);
        //    this.closePath();
        //    return this;
        //}
    }

    export function createCanvas(name: string)
    {

        var canvas = <HTMLCanvasElement>document.createElement('canvas');
        canvas.id = name;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.position = "absolute";
        canvas.style.left = "0px";
        canvas.style.top = "0px";
        window.document.body.appendChild(canvas);

        //Disable context menu so I can use right click for game controls
         $('body').on('contextmenu', "#"+name, function (e){ 
            return false;
        });

        window.onresize = function () => {
            //TODO somthing about this
            // canvas.width = window.innerWidth;
            // canvas.height = window.innerHeight;
        };

        return canvas;

    }

}