class GamePad
{
    isConnected;
    pad;
    padNumber;

    static numPads = 0;

    constructor()
    {
        this.isConnected = false;
        this.pad = null;
    }

    connect()
    {
        var gamepadSupportAvailable = !!(<any>navigator).webkitGetGamepads || !!(<any>navigator).webkitGamepads || (<any>navigator).webkitGamepads[0] != undefined;

        // If unsopprted or already connected then do nothing
        if (gamepadSupportAvailable == false || this.isConnected)
        {
            return false;
        } else
        {
            var pads = (<any>navigator).webkitGetGamepads();

            if (pads[GamePad.numPads] != undefined)
            {
                this.padNumber = GamePad.numPads;
                this.pad = pads[GamePad.numPads];
                this.isConnected = true;
                GamePad.numPads++;
            }

        }
    }

    update()
    {
        if (this.isConnected)
        {
            this.pad = (<any>navigator).webkitGetGamepads()[this.padNumber];
        }
    }

    isButtonPressed(buttonId)
    {

        if (this.isConnected)
        {
            return this.pad.buttons[buttonId] && (this.pad.buttons[buttonId] == 1);
        }
        else
        {
            return false;
        }

    }

    getAxis(axisId)
    {
        if (this.isConnected)
        {
            if (typeof this.pad.axes[axisId] != 'undefined')
            {
                return this.pad.axes[axisId];
            }
        }

        return false;
    }
}