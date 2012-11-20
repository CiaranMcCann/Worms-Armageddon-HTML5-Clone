///<reference path="../system/Utilies.ts"/>
declare var webkitAudioContext;

// Sound object
class Sound
{
    static context = new webkitAudioContext();
    static soundOn = true;

    buffer;
    private volume;
    private playing;

    constructor (buffer, volume = 1)
    {
        this.buffer = buffer;
        this.volume = volume;
        this.playing = false;

        if (!this.buffer)
        {
            Logger.error("buffer null");
        }
    }

    play(time = 0)
    {
        if (Sound.soundOn)
        {
            // if sound is playing don't replay it
            if (this.playing == false)
            {
                var source = Sound.context.createBufferSource();
                source.buffer = this.buffer;
                source.connect(Sound.context.destination);

                var gainNode = Sound.context.createGainNode();
                source.connect(gainNode);
                gainNode.connect(Sound.context.destination);
                gainNode.gain.value = this.volume;
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