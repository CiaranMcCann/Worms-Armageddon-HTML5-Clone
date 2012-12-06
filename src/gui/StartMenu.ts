/**
 * StartMenu.js
 * This is the first menu the user interacts with
 * allows them to start the game and shows them the controls.
 *
 *  License: Apache 2.0
 *  author:  Ciarán McCann
 *  url: http://www.ciaranmccann.me/
 */
///<reference path="../Settings.ts" />
///<reference path="../system/Controls.ts"/>
declare var $;

class StartMenu
{
    controlsView;
    menuActive;

    constructor ()
    {
        this.menuActive = !Settings.DEVELOPMENT_MODE;

        //TODO gamepad controls
        //<img style="width:80%" src="data/images/menu/xbox360controls.png"><h2>Or</h2>
        this.controlsView = '<div style="text-align:center">' +
            ' <p>Just incase you have never played the original worms armageddon, its a turn base deathmatch game. Where you control a team of worms. Use whatever weapons you have to destroy the enemy. <p><br>' +
            '<p><kbd> Space' +
            '</kbd>  <kbd> ' + String.fromCharCode(Controls.walkLeft.keyboard) +
            '</kbd> <kbd> ' + String.fromCharCode(Controls.walkRight.keyboard) +
            '</kbd> - Jump, Left, Right. <br> <br>' +
             ' <kbd>'+  String.fromCharCode(Controls.aimUp.keyboard)  +'</kbd> ' +
             ' <kbd>'+  String.fromCharCode(Controls.aimDown.keyboard)  +'</kbd> ' +
             ' - Aim up and down. </p><br>' +        
            ' <kbd>'+  String.fromCharCode(Controls.toggleWeaponMenu.keyboard)  +'</kbd> - Weapon Menu. </p><br>' +        
            ' <kbd>Enter</kbd> or left mouse - Fire weapon. </p><p></p><br><br>' +
            '<a class="btn btn-primary btn-large" id="startLocal" style="text-align:center">Lets play!</a></div>';

    }

    onGameReady(callback)
    {
        var _this = this;
        if (this.menuActive)
        {
             $(window).one("keydown",function (e)
             {
                 if (e.which == 13)
                 {
                     _this.controlsMenu(callback);
                 }

             });

            setTimeout(function =>
            {
                $('#startMenu').fadeIn('fast');
                $('#splashScreen').css({ opacity: '0.8' })

                $('#startLocal').click(function =>
                {
                    _this.controlsMenu(callback);
                });

                 $('#startTutorial').click(function =>
                {
                    _this.controlsMenu(callback);
                });

            }, 100); //TODO: remove once all sprites are in articifal load delay
        } else
        {
            $('#splashScreen').remove();
            callback();
        }
    }

    controlsMenu(callback)
    {
         $(window).one("keydown",function (e)
             {
                 if (e.which == 13)
                 {
                     $('#splashScreen').remove();
                     $('#startMenu').fadeOut('normal');
                     callback();
                 }

             });

        $('.slide').fadeOut('normal', function =>
        {
            $('.slide').empty();
            $('.slide').append(this.controlsView);
            $('.slide').fadeIn('slow');

            $('#startLocal').click(function =>
            {
                $('#startLocal').unbind();
                $('#splashScreen').remove();
                $('#startMenu').fadeOut('normal');
                callback();
            })
        });
    }

}