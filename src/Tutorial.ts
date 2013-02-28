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

    displayCommandMessage(currentCommand : number)
    {
        GameInstance.miscellaneousEffects.stopAll();
        var pos = Physics.vectorMetersToPixels(GameInstance.state.getCurrentPlayer().getTeam().getCurrentWorm().body.GetPosition());
        pos.y -= 200;

        var cam = GameInstance.camera;
        GameInstance.miscellaneousEffects.add(new ToostMessage(
            pos,
            tutorialCommandBank[currentCommand].message,
           "#0099CC",990000,0.0)
         );
    }

    update()
    {
        //This kicks off the commands
        if (this.currentCommand == -1)
        {
            this.currentCommand = 0;
            this.displayCommandMessage(this.currentCommand);

            //pause game timer to give player a chance at the game
            GameInstance.gameTimer.timer.pause();
        }

        if (this.isFinished == false && tutorialCommandBank[this.currentCommand].detection())
        {
            if (this.timeOut == null)
            {

                this.timeOut = setTimeout(function () => {

                    this.nextCommand();

                    if (this.isFinished == false)
                    {
                        this.displayCommandMessage(this.currentCommand);
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
         message: " Move left press A and move right press D",
         detection: function ()
         {
             console.log("check for walking");
             if (keyboard.isKeyDown(Controls.walkLeft.keyboard) || keyboard.isKeyDown(Controls.walkRight.keyboard))
             {
                 console.log("walking");
                 return true;
             }
         },
     },

     {
        message: "Cool, alright now press space bar to jump",
        detection: function ()
        {
            if (keyboard.isKeyDown(Controls.jump.keyboard) )
            {
                return true;
            }
        },
    },

    {
        message: " Now, see the red target circle near you? W and S move rotate it around.",
        detection: function ()
        {
            if (keyboard.isKeyDown(Controls.aimDown.keyboard) || keyboard.isKeyDown(Controls.aimUp.keyboard))
            {
                return true;
            }
        },
    },

    {
        message: " Lets have some fun! Pick a weapon by pressing E or right mouse click. Click on the Holy Gernade in the menu",
        detection: function ()
        {
            if ( GameInstance.state.getCurrentPlayer().getTeam().getWeaponManager().getCurrentWeapon() instanceof HolyGrenade )
            {
                return true;
            }
        },
    }

]
