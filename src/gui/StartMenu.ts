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
///<reference path="SettingsMenu.ts"/>
declare var $;

class StartMenu
{
    controlsView;
    settingsMenu: SettingsMenu;
    static callback;

    constructor()
    {
        //TODO gamepad controls
        //<img style="width:80%" src="data/images/menu/xbox360controls.png"><h2>Or</h2>
        this.controlsView = '<div style="text-align:center">' +
            ' <p>Just incase you have never played the original worms armageddon, its a turn base deathmatch game. Where you control a team of worms. Use whatever weapons you have to destroy the enemy. <p><br>' +
            '<p><kbd> Space' +
            '</kbd>  <kbd> ' + String.fromCharCode(Controls.walkLeft.keyboard) +
            '</kbd> <kbd> ' + String.fromCharCode(Controls.walkRight.keyboard) +
            '</kbd> - Jump, Left, Right. <br> <br>' +
             ' <kbd>' + String.fromCharCode(Controls.aimUp.keyboard) + '</kbd> ' +
             ' <kbd>' + String.fromCharCode(Controls.aimDown.keyboard) + '</kbd> ' +
             ' - Aim up and down. </p><br>' +
            ' <kbd>' + String.fromCharCode(Controls.toggleWeaponMenu.keyboard) + '</kbd> or right mouse - Weapon Menu. </p><br>' +
            ' <kbd>Enter</kbd> - Fire weapon. </p><p></p><br>' +
            '<a class="btn btn-primary btn-large" id="startLocal" style="text-align:center">Lets play!</a></div>';
    }

    hide()
    {
        $('#startMenu').remove();
    }


    onGameReady(callback)
    {

        var _this = this;
        StartMenu.callback = callback;
        if (!Settings.DEVELOPMENT_MODE)
        {
            var loading = setInterval(function () =>
            {

                $('#notice').empty();
                if (AssetManager.getPerAssetsLoaded() >= 100)
                {
                    clearInterval(loading);
                    this.settingsMenu = new SettingsMenu();
                    $('#startLocal').removeAttr("disabled");
                    $('#startOnline').removeAttr("disabled");
                  

                    // IE tell the user to get a better browser, but still allow them to play
                    if ($.browser.msie)
                    {
                         $('#startTutorial').removeAttr("disabled");
                        $('#notice').append('<div class="alert alert-error" style="text-align:center">' +
                            '<strong>Bad news :( </strong> Your using Internet explorer, the game preformance will be hurt. For best preformance use ' +
                            '<a href="https://www.google.com/intl/en/chrome/browser/">Chrome</a> or <a href="http://www.mozilla.org/en-US/firefox/new/">FireFox</a>. </div> ');
                    } else if (TouchUI.isTouchDevice())
                    {
                        $('#notice').append('<div class="alert alert-error" style="text-align:center">' +
                            '<strong>Hey tablet user</strong> There may be performance problems and some missing features in the tablet version. You can still play though!</div> ');
                    }
                    else
                    {
                        $('#startTutorial').removeAttr("disabled");
                        $('#notice').append('<div class="alert alert-success" style="text-align:center"> <strong> Games loaded and your ready to play!! </strong><br> Also thanks for using a modern browser. <a href="#" id="awesome">Your awesome!</a></div> ');
                        $('#awesome').click(function => {
                            Notify.display("Awesome!", "<img src='../data/images/awesome.jpg'/>", 5000);
                        });
                    }

                } else
                {
                    $('#notice').append('<div class="alert alert-info" style="text-align:center"> <strong> Stand back! I\'m loading game assets! </strong>' +
                    '<div class="progress progress-striped active"><div class="bar" style="width: ' + AssetManager.getPerAssetsLoaded() + '%;"></div></div></div> ');
                }

            }, 500);


            $('#startLocal').click(function =>
            {
                if (AssetManager.isReady())
                {
                    $('#startLocal').off('click');
                    AssetManager.getSound("CursorSelect").play();
                    $('.slide').empty();
                    $('.slide').append(this.settingsMenu.getView());
                    this.settingsMenu.bind(function () => {
                        AssetManager.getSound("CursorSelect").play();
                        this.controlsMenu(callback);
                    });

                }


            });

            $('#startOnline').click(function =>
            {
                  $('#startOnline').off('click');
                if (AssetManager.isReady())
                {
                    if (GameInstance.lobby.client_init() != false)
                    {
                        $('#notice').empty();
                        GameInstance.lobby.menu.show(callback);
                        AssetManager.getSound("CursorSelect").play();
                    } else
                    {
                        $('#notice').empty();
                        $('#notice').append('<div class="alert alert-error"> <strong> Oh Dear! </strong> Looks like the multiplayer server is down. Try a local game for a while?</div> ');

                    }
                }

            });

            $('#startTutorial').click(function =>
            {
                $('#startTutorial').off('click');
                if (AssetManager.isReady())
                {
                    AssetManager.getSound("CursorSelect").play();

                    //Initalizse the tutorial object so its used in the game
                    GameInstance.tutorial = new Tutorial();

                    _this.controlsMenu(callback);
                }
            });


        } else
        {
            //Development Mode - Just make sure all assets are loaded first
            var loading = setInterval(function () =>
            {   
                if (AssetManager.getPerAssetsLoaded() == 100)
                {
                    clearInterval(loading);
                    callback();               
                }
            },2)
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
                AssetManager.getSound("CursorSelect").play();
                AssetManager.getSound("StartRound").play(1, 0.5);
                callback();
            })
        });
    }

}