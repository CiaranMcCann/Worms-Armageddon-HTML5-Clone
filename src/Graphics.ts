module Graphics {

    export function init() {
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
      canvas.width =  window.innerWidth;
      canvas.height = window.innerHeight;
      window.document.body.appendChild(canvas);

      window.onload = window.onresize = function() => {
           // canvas.width = window.innerWidth;
           // canvas.height = window.innerHeight;
      };

      return canvas;

    }

}