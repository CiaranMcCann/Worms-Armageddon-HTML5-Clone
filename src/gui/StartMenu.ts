declare var $;

//This is the first menu the user interacts with
// allows them to start the game and shows them the controls.
class StartMenu
{
    controlsView;
    menuActive;

    constructor ()
    {
        this.menuActive = false;
        this.controlsView = '<h1 style="text-align: center">Controls</h1><p><p><br>' +
            '<img src="data/img/xbox360controls.png"><p><p><br />' +
            '<a class="btn btn-primary btn-large" id="startLocal" style="text-align:center">Lets play!</a>';
    }

    onGameReady(callback)
    {
        var _this = this;
        if (this.menuActive)
        {
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