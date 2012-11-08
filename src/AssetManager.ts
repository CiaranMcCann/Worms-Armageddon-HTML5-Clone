///<reference path="audio/Sound.ts"/>

module AssetManager {

   var priorityImages = [
        'data/img/wormsBackGround.png',
        'data/img/bananabomb.png',
        'data/img/worm.png', 
        'data/img/worms/waccuse.png'
    ];

    var priorityAudio = [
        "data/sounds/explosion1.wav",
        "data/sounds/explosion2.wav",
        "data/sounds/explosion3.wav"
    ]

    export var images = {};
    export var sounds = {};

    export function loadImages(sources, callback) {

        var images = {};
        var loadedImages = 0;
        var numImages = 0;
        // get num of sources
        for (var src in sources) {
            numImages++;
        }
        for (var src in sources) {
            var name =  sources[src].match("[a-z,A-Z,0-9]+[.]")[0].replace(".", "");
            images[name] = new Image();
            images[name].onload = function () {
                Logger.log(" Image " + sources[src] + " loaded sucessfully ");
                if (++loadedImages >= numImages) {
                    AssetManager.images = images;
                    callback();
                }
            };
            images[name].src = sources[src];
        }

    }

    export function loadPriorityAssets(callback) {
        loadImages(priorityImages, function () {
            loadSounds(priorityAudio, callback);
        });
    }

    export function loadSounds(sources, callback) {
        var bufferLoader = new BufferLoader(Sound.context, sources, function (bufferList) {

             for (var i = 0; i < bufferList.length; i++) {
                    sounds[bufferList[i].name] = bufferList[i].buffer;
             }

             callback();
        });
      bufferLoader.load();
    }

}