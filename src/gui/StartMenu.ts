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
declare var $;

class StartMenu
{
    controlsView;
    menuActive;

    constructor ()
    {
        this.menuActive = !Settings.DEVELOPMENT_MODE;
        this.controlsView = '<div style="text-align:center">' +
            '<img style="width:80%" src="data/images/menu/xbox360controls.png"> <h2>Or</h2>' +
            '<p><kbd>W</kbd> <kbd>A</kbd> <kbd>D</kbd> - Jump, Left, Right. <br> ' +
            ' <kbd>E</kbd> - Weapon Menu. </p>' +
            ' <kbd>Enter</kbd> - Fire weapon. </p><p></p><br><br>' +
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

            }, 1200); //TODO: remove once all sprites are in articifal load delay
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
                     $('#splashScreen').css({ opacity: '0.0' })
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
                $('#splashScreen').css({ opacity: '0.0' })
                $('#startMenu').fadeOut('normal');
                callback();
            })
        });
    }

}