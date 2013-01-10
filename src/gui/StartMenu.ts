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
///<reference path="LobbyMenu.ts"/>
declare var $;

class StartMenu
{
    controlsView;
    menuActive;
    lobbyMenu: LobbyMenu;

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
            ' <kbd>'+  String.fromCharCode(Controls.toggleWeaponMenu.keyboard)  +'</kbd> or right mouse - Weapon Menu. </p><br>' +        
            ' <kbd>Enter</kbd> - Fire weapon. </p><p></p><br>' +
            '<a class="btn btn-primary btn-large" id="startLocal" style="text-align:center">Lets play!</a></div>';

        this.lobbyMenu = new LobbyMenu();

    }

    onGameReady(callback)
    {       
        var _this = this;
        if (this.menuActive)
        {

            setTimeout(function =>
            {
                $('#splashScreen').remove();
                $('#startMenu').fadeIn('fast');

                $('#startLocal').click(function =>
                {
                    AssetManager.sounds["CursorSelect"].play();
                    _this.controlsMenu(callback);
                });

                 $('#startOnline').click(function =>
                {
                     //Setup multiplayer
                     GameInstance.lobby.init();
                     GameInstance.lobby.menu.show(callback);

                     AssetManager.sounds["CursorSelect"].play();
                    
                });

                 $('#startTutorial').click(function =>
                {
                     AssetManager.sounds["CursorSelect"].play();
                    _this.controlsMenu(callback);
                });

            }, 1000); //TODO: remove once all sprites are in articifal load delay
        } else
        {
            $('#splashScreen').remove();
            callback();
        }
    }

    controlsMenu(callback)
    {

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
                AssetManager.sounds["CursorSelect"].play();
                AssetManager.sounds["StartRound"].play(1, 0.5);
                callback();
            })
        });
    }

}