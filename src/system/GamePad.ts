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

        try
        {
            (<any>navigator).webkitGetGamepads()
        } catch (e)
        {
            return false;
        }

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


function Stick(maxLength, active)
{
    this.active = active;
    this.atLimit = false;
    this.length = 1;
    this.maxLength = maxLength;
    this.limit = {
        x: 0,
        y: 0
    };
    this.input = {
        x: 0,
        y: 0
    };

};

Stick.prototype.getRadians = function (x, y)
{
    return Math.atan2(x, -y);
};

Stick.prototype.getVectorFromRadians = function (radians, length)
{
    length = (Number(length) || 1);
    return {
        x: (Math.sin(radians) * length),
        y: (-Math.cos(radians) * length)
    };
};

Stick.prototype.getVectorLength = function (v)
{
    return Math.sqrt((v.x * v.x) + (v.y * v.y));
};

Stick.prototype.getVectorNormal = function (v)
{
    var len = this.getVectorLength(v);
    if (len === 0)
    {
        return v;
    } else
    {
        return {
            x: (v.x * (1 / len)),
            y: (v.y * (1 / len))
        };
    }
};

Stick.prototype.setLimitXY = function (x, y)
{
    this.limit = {
        x: x,
        y: y
    };
};

Stick.prototype.setInputXY = function (x, y)
{
    this.input = {
        x: x,
        y: y
    };
};

Stick.prototype.subtractVectors = function (v1, v2)
{
    return {
        x: (v1.x - v2.x),
        y: (v1.y - v2.y)
    };
};

Stick.prototype.update = function ()
{
    var diff = this.subtractVectors(this.input, this.limit);
    var length = this.getVectorLength(diff);

    if (Math.round(length) >= this.maxLength)
    {
        length = this.maxLength;

        var rads = this.getRadians(diff.x, diff.y);

        this.atLimit = true;
        this.input = this.getVectorFromRadians(rads, length);
        this.input.x += this.limit.x;
        this.input.y += this.limit.y;
    } else
    {
        this.atLimit = false;
    }

    this.length = length;
    this.normal = this.getVectorNormal(diff);
};


function TwinStickControls(canvas)
{
    this.limitSize = 64;
    this.inputSize = 36;
    this.sticks = [new Stick(this.inputSize), new Stick(this.inputSize)];

    var _this = this;
    canvas.addEventListener("touchstart", function (e)
    {
        e.preventDefault();

        for (var i = 0; i < e.touches.length; ++i)
        {
            var stick = _this.sticks[i];
            var touch = e.touches[i];

            stick.setLimitXY(touch.pageX, touch.pageY);
            stick.setInputXY(touch.pageX, touch.pageY);
            stick.active = true;
        }
    });

    document.addEventListener("touchmove", function (e)
    {
        e.preventDefault();

        for (var i = 0; i < e.touches.length; ++i)
        {
            var stick = _this.sticks[i];
            var touch = e.touches[i];

            stick.setInputXY(touch.pageX, touch.pageY);
        }
    });

    document.addEventListener("touchend", function (e)
    {
        var touches = e.changedTouches;
        for (var i = 0; i < touches.length; ++i)
        {
            var stick = _this.sticks[i];
            stick.active = false;
        }
    });
}

TwinStickControls.prototype.update = function ()
{
    for (var i = 0; i < this.sticks.length; ++i)
    {
        this.sticks[i].update();

        if (this.sticks[i].active && this.sticks[i].length > 30)
        {
            if (this.sticks[i].normal.x > 0.8)
            {
                GameInstance.state.getCurrentPlayer().getTeam().getCurrentWorm().walkRight();

            } else if (this.sticks[i].normal.x < -0.8)
            {

                GameInstance.state.getCurrentPlayer().getTeam().getCurrentWorm().walkLeft();
            }

            if (this.sticks[i].normal.y > 0.4)
            {
                GameInstance.state.getCurrentPlayer().getTeam().getCurrentWorm().target.aim(0.8);

            } else if (this.sticks[i].normal.y < -0.4)
            {

                GameInstance.state.getCurrentPlayer().getTeam().getCurrentWorm().target.aim(-0.8);
            }
        }
    }
}

TwinStickControls.prototype.draw = function (context)
{

    for (var i = 0; i < this.sticks.length; ++i)
    {
        var stick = this.sticks[i];

        if (stick.active)
        {
            context.save();

            // Limit
            context.beginPath();
            context.arc(stick.limit.x, stick.limit.y, this.limitSize, 0, (Math.PI * 2), true);

            context.lineWidth = 3;
            if (stick.atLimit)
            {
                context.strokeStyle = "rgb(200, 0, 0)";
            } else
            {
                context.strokeStyle = "rgb(0, 0, 0)";
            }
            context.stroke();

            // Base
            context.beginPath();
            context.arc(stick.limit.x, stick.limit.y, (this.limitSize / 2), 0, (Math.PI * 2), true);

            context.lineWidth = 3;
            context.strokeStyle = "rgb(200, 200, 200)";
            context.stroke();

            // Input
            //context.beginPath();
            //context.arc(stick.input.x, stick.input.y, inputSize, 0, (Math.PI * 2), true);
            //context.fillStyle = "rgb(0, 0, 200)";
            //context.fill();
            context.drawImage(AssetManager.getImage("stick"), stick.input.x - (this.inputSize), stick.input.y - (this.inputSize), this.inputSize * 2, this.inputSize * 2);

            context.restore();
        }
    }
}

