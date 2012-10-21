module Graphics {

    export var stats;

    export function init() {

        stats = new Stats();

        // Align top-left
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';

        document.body.appendChild(stats.domElement);

        // requestAnim shim layer by Paul Irish
        window.requestAnimationFrame = (function () {
            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
            function ( /* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60);
            };

        })();
    }

    export function createCanvas() {

        var canvas = document.createElement('canvas');
        canvas.id = "canvas";
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        window.document.body.appendChild(canvas);

        window.onload = window.onresize = function () => {
            // canvas.width = window.innerWidth;
            // canvas.height = window.innerHeight;
        };

        return canvas;

    }

}