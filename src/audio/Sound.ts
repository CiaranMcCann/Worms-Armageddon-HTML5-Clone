/**
 * Sound.js
 * Sound wraps the Web audio api. When a sound file is loaded 
 * one of these is created using the sound buffer. It allows for a 
 * cleaner and simple api for doing basic things like playing sound, controling volume etc
 *
 * SoundFallback use just the simple Audio tag, works ok but not as feature full as web audio api.
 * 
 *  License: Apache 2.0
 *  author:  Ciarán McCann
 *  url: http://www.ciaranmccann.me/
 */
///<reference path="../system/Utilies.ts"/>
declare var webkitAudioContext; 

class Sound
{
    static context;

    source;
    buffer;
    playing;

    constructor(buffer)
    {
        this.buffer = buffer;
        this.playing = false;

        if (!this.buffer)
        {
            Logger.error("buffer null");
        }
    }

    play(volume = 1, time = 0, allowSoundOverLay = false)
    {
        if (Settings.SOUND && this.buffer != null)
        {
            // if sound is playing don't replay it
            if (this.playing == false || allowSoundOverLay == true)
            {
                this.source = Sound.context.createBufferSource();
                this.source.buffer = this.buffer;

                var gainNode = Sound.context.createGainNode();
                this.source.connect(gainNode);
                gainNode.connect(Sound.context.destination);
                gainNode.gain.value = volume;
                this.source.noteOn(time);
                this.playing = true;
                var bufferLenght = this.buffer.duration;

                setTimeout(function () {
                    this.playing = false;
                }, bufferLenght * 1000);
            }

        } else
        {
            Logger.debug("Sounds are currently disabled");
        }
    }

    isPlaying()
    {
        return this.playing;
    }

    pause()
    {
        if (Settings.SOUND && this.buffer != null) {
            if (typeof(this.source.noteOff) !== 'undefined') {
                this.source.noteOff(0);
            }
        }
    }


}

//SoundFallback use just the simple Audio tag, works ok but not as feature full as web audio api.
class SoundFallback extends Sound
{
    audio: HTMLAudioElement;

    constructor(soundSrc)
    {
        super(soundSrc);  
        this.load(soundSrc);
    }

    load(soundSrc)
    {
          this.audio = <HTMLAudioElement>document.createElement("Audio");

        // When the sound loads sucesfully tell the asset manager
        $(this.audio).on("loadeddata", function ()
        {
            AssetManager.numAssetsLoaded++;
            Logger.log(" Sound loaded " + this.audio.src );
        });

        this.audio.onerror = () => {
            Logger.error( " Sound failed to load " + this.audio.src);
        }

        this.audio.src = soundSrc;
        $('body').append(this.audio);


    }

    play(volume = 1, time = 0, allowSoundOverLay = false)
    {
        if (Settings.SOUND)
        {
            // if sound is playing don't replay it
            //if (this.playing == false || allowSoundOverLay == true)
            {

                this.audio.volume = volume;    
                this.audio.play();
                this.playing = true;
            }

        } else
        {
            Logger.debug("Sounds are currently disabled");
        }
    }

    isPlaying()
    {
        return this.playing;
    }

    pause()
    {
        if (Settings.SOUND)
        {
            this.audio.pause();
        }
    }
}


