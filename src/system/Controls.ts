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
        keyboard: 87,
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