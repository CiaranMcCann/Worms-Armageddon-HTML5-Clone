module Utilies {

    export function random(min,max){
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

}

module Logger {

    export var loggingActive = true;

    export function log(message) {
        if(loggingActive)
        console.log(message);
    }

}

module keyboard {

    var keys = [];

    (function () {

        $(window).keydown(function (e) {
            keys[e.which] = true;
        });

        $(window).keyup(function (e) {
            delete keys[e.which];
        });

    })();

    export function isKeyDown(keyCode){
	    for( var key in keys ){
		    if(key == keyCode)
		      return true;  
	    }

	    return false;
}

}