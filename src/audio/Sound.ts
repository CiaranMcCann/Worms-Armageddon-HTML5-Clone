/**
 * Sound.js
 * This wraps the Web audio api. When a sound file is loaded 
 * one of these is created using the sound buffer. It allows for a 
 * cleaner and simple api for doing basic things like playing sound, controling volume etc
 *
 *  License: Apache 2.0
 *  author:  Ciarán McCann
 *  url: http://www.ciaranmccann.me/
 */
///<reference path="../system/Utilies.ts"/>
declare var webkitAudioContext; //TODO implement support for other browsers

class Sound
{
    static context = new webkitAudioContext();

    buffer;
    private playing;

    constructor (buffer)
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
        if (Settings.SOUND)
        {
            // if sound is playing don't replay it
            if (this.playing == false || allowSoundOverLay == true)
            {
                var source = Sound.context.createBufferSource();
                source.buffer = this.buffer;

                var gainNode = Sound.context.createGainNode();
                source.connect(gainNode);
                gainNode.connect(Sound.context.destination);
                gainNode.gain.value = volume;
                source.noteOn(time);
                this.playing = true;
                var bufferLenght = this.buffer.duration;

                setTimeout(function () => {
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


}