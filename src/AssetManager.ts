///<reference path="audio/Sound.ts"/>

module AssetManager {

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
            images[src] = new Image();
            images[src].onload = function () {
                if (++loadedImages >= numImages) {
                    AssetManager.images = images;
                    callback();
                }
            };
            images[src].src = sources[src];
        }

    }

    export function loadPriorityAssets(audioSources, imageSources, callback) {
        loadImages(imageSources, function () {
            loadSounds(audioSources, function (bufferList) {

                for (var i = 0; i < bufferList.length; i++) {
                    sounds[bufferList[i].name] = bufferList[i].buffer;
                }
                callback();

            });
        });
    }

    export function loadSounds(sources, callback) {

      var bufferLoader = new BufferLoader(Sound.context,sources,callback);
      bufferLoader.load();

    }

}