///<reference path="../audio/Sound.ts"/>
declare var BufferLoader;

module AssetManager
{

    var remoteAssetServer = "http://www.ciaranmccann.me/fyp/";

    var priorityImages = [
         'data/img/wormsBackGround.png',
         'data/img/bananabomb.png'

    ];

    var priorityAudio = [
        "data/sounds/explosion1.wav",
        "data/sounds/explosion2.wav",
        "data/sounds/explosion3.wav",
        "data/sounds/WalkExpand.wav",
        "data/sounds/WalkCompress.wav",
        "data/sounds/DRILL.WAV",
        "data/sounds/JUMP1.WAV",
        "data/sounds/TIMERTICK.WAV",
        "data/sounds/Speech/Irish/hurry.wav"
    ]

    export var images = [];
    export var sounds = [];

    export function loadImages(sources, callback)
    {

        var images = [];
        var loadedImages = 0;
        var numImages = 0;
        // get num of sources
        for (var src in sources)
        {
            numImages++;
        }
        for (var src in sources)
        {
            var name = sources[src].match("[a-z,A-Z,0-9]+[.]png")[0].replace(".png", "");
            images[name] = new Image();
            images[name].onload = function ()
            {
                Logger.log(" Image " + this.src + " loaded sucessfully ");
                if (++loadedImages >= numImages)
                {
                    AssetManager.images = images;
                    callback();
                }
            };
            images[name].src = sources[src];
        }

    }

    export function loadPriorityAssets(callback)
    {
        // Load all sprites
        for (var sprite in Sprites.worms)
        {
            priorityImages.push(remoteAssetServer + "data/img/" + Sprites.worms[sprite].imageName + ".png");
        }

        loadImages(priorityImages, function ()
        {
            loadSounds(priorityAudio, callback);
        });
    }

    export function loadSounds(sources, callback)
    {
        var bufferLoader = new BufferLoader(Sound.context, sources, function (bufferList)
        {

            for (var i = 0; i < bufferList.length; i++)
            {
                sounds[bufferList[i].name] = new Sound(bufferList[i].buffer);
            }

            callback();
        });
        bufferLoader.load();
    }

}