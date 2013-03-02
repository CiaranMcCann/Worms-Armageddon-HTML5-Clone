/**
 *  
 * Centrialized location for controls and input
 *
 *  TODO Complete this when intergrating gamepad
 *
 *  License: Apache 2.0
 *  author:  Ciarán McCann
 *  url: http://www.ciaranmccann.me/
 */
module Controls
{
    export var toggleWeaponMenu =
    {
        gamepad: -1,
        keyboard: 101,
        mouse: 3
    }

    export var walkLeft =
    {
        gamepad: -1,
        keyboard: 65,
        mouse: -1
    }

    export var walkRight =
    {
        gamepad: -1,
        keyboard: 68,
        mouse: -1
    }

    export var jump =
    {
        gamepad: -1,
        keyboard: 32,
        mouse: -1
    }

    export var backFlip =
    {
        gamepad: -1,
        keyboard: keyboard.keyCodes.Backspace,
        mouse: -1
    }

    export var aimUp =
    {
        gamepad: -1,
        keyboard: 87,
        mouse: -1
    }

    export var aimDown =
    {
        gamepad: -1,
        keyboard: 83,
        mouse: -1
    }

    export var fire =
    {
        gamepad: -1,
        keyboard: 13,
        mouse: 1
    }

    export function checkControls(control,key)
    {
        return (key == control.gamepad || key == control.keyboard ||  key == control.mouse);
    }


}