/**
 * Tutorial.js
 *
 *  License: Apache 2.0
 *  author:  Ciarán McCann
 *  url: http://www.ciaranmccann.me/
 */
///<reference path="system/Utilies.ts"/>
///<reference path="animation/HealthReduction.ts" />
///<reference path="Settings.ts" />


class Tutorial
{

    currentCommand;
    isFinished: bool;
    timeOut;

    constructor()
    {
        this.currentCommand = -1;
        this.isFinished = false;
    }

    nextCommand()
    {
        this.currentCommand++;

        if (tutorialCommandBank.length == this.currentCommand)
        {
            this.isFinished = true;
            GameInstance.miscellaneousEffects.stopAll();
        }
    }

    displayCommandMessage(currentCommand : number, displayTime : number)
    {
        Notify.hide(function ()
        {
            Notify.display(tutorialCommandBank[currentCommand].header, tutorialCommandBank[currentCommand].message, displayTime);
        });
    }

    update()
    {
        //Displays message forever
        var displayTime = -1;

        //This kicks off the commands
        if (this.currentCommand == -1)
        {
            this.currentCommand = 0;
            this.displayCommandMessage(this.currentCommand,displayTime );

            //pause game timer to give player a chance at the game
            GameInstance.gameTimer.timer.pause();
        }

        if (this.isFinished == false && tutorialCommandBank[this.currentCommand].detection())
        {
            if (this.timeOut == null)
            {

                this.timeOut = setTimeout(function () => {

                    this.nextCommand();

                    //If last message set time for it to disppaer
                    if (this.currentCommand == tutorialCommandBank.length-1)
                    {
                        displayTime = 9000;
                    }

                    if (this.isFinished == false)
                    {
                        this.displayCommandMessage(this.currentCommand,displayTime);
                    }

                    clearTimeout(this.timeOut);
                    this.timeOut = null;

                }, 2000);
            }
        }
    }

}

var tutorialCommandBank = [


     {
         header: "Movement 101",
         message: " Move left press <strong>"+ keyboard.getKeyName(Controls.walkLeft.keyboard) +"</strong> and move right press <strong>" +  keyboard.getKeyName(Controls.walkRight.keyboard)+"</strong>",
         detection: function ()
         {
             if (keyboard.isKeyDown(Controls.walkLeft.keyboard) || keyboard.isKeyDown(Controls.walkRight.keyboard))
             {
                 return true;
             }
         },
     },

     {
        header: "Jumping",
        message: "Cool, alright now press <strong>"+ keyboard.getKeyName(Controls.jump.keyboard) +"</strong> to jump",
        detection: function ()
        {
            if (keyboard.isKeyDown(Controls.jump.keyboard) )
            {
                return true;
            }
        },
    },

     {
        header: "BackFlip",
        message: "Try a backflip now press <strong>"+ keyboard.getKeyName(Controls.backFlip.keyboard) +"</strong>",
        detection: function ()
        {
            if (keyboard.isKeyDown(Controls.backFlip.keyboard) )
            {
                return true;
            }
        },
    },

    {
        header: "Aiming",
        message: " Now, see the red target circle near you? <strong>"+ keyboard.getKeyName(Controls.aimUp.keyboard) +"</strong> and <strong>"+ keyboard.getKeyName(Controls.aimDown.keyboard) +"</strong> to rotate it around.",
        detection: function ()
        {
            if (keyboard.isKeyDown(Controls.aimDown.keyboard) || keyboard.isKeyDown(Controls.aimUp.keyboard))
            {
                return true;
            }
        },
    },

    {
        header: "Weapon Selection",
        message: " Lets have some fun! Pick a weapon by pressing <strong>"+ keyboard.getKeyName(Controls.toggleWeaponMenu.keyboard) +"</strong> or right mouse click. Click on the Holy Gernade in the menu",
        detection: function ()
        {
            if ( GameInstance.state.getCurrentPlayer().getTeam().getWeaponManager().getCurrentWeapon() instanceof HolyGrenade )
            {
                return true;
            }
        },
    },

    {
        header: "Firing weapon",
        message: "Now take aim using the red target. Hold <strong>"+ keyboard.getKeyName(Controls.fire.keyboard) +"</strong> and then release it to throw gernade",
        detection: function ()
        {

            if ( GameInstance.state.getCurrentPlayer().getTeam().getWeaponManager().getCurrentWeapon().isActive)
            {
                return true;
            }
        },
    },

    {
        header: "Looking around the map",
        message: "You can move the camera around using the arrow keys, give it a shot",
        detection: function ()
        {
            if (keyboard.isKeyDown(keyboard.keyCodes.Leftarrow) || 
                keyboard.isKeyDown(keyboard.keyCodes.Downarrow) ||
                keyboard.isKeyDown(keyboard.keyCodes.Rightarrow) ||
                keyboard.isKeyDown(keyboard.keyCodes.Uparrow) )
            {
                return true;
            }
        },
    },

    {
        header: "Jetpack",
        message: "So select the Jetpack from the weapons menu, press <strong>"+ keyboard.getKeyName(Controls.jump.keyboard) +"</strong> and then use directional keys to move",
        detection: function ()
        {
            var weapon = GameInstance.state.getCurrentPlayer().getTeam().getWeaponManager().getCurrentWeapon();
            if ( weapon.isActive && weapon instanceof JetPack)
            {
                return true;
            }
        },
    },

     {
        header: "Awesome!",
        message: "Well Done! Your finished the tutorial, you can just mess around or start a new game",
        detection: function ()
        {            
                return true;
        },
    }

]
