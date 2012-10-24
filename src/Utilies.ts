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