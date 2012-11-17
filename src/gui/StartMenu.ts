declare var $;

class StartMenu
{
    controlsView;
    menuActive;

    constructor ()
    {
        this.menuActive = true;
        this.controlsView = '<h1 style="text-align: center">Controls</h1><p><p><br>' +
            '<img src="data/img/xbox360controls.png"><p><p><br />' +
            '<a class="btn btn-primary btn-large" id="startLocal" style="text-align:center">Lets play!</a>';

    }

    onGameReady(callback)
    {
        if (this.menuActive)
        {
            setTimeout(function =>
            {
                $('#startMenu').fadeIn('fast');
                $('#splashScreen').css({ opacity: '0.8' })

                $('#startLocal').click(function =>
                {
                    $('.slide').fadeOut('normal', function =>
                    {
                        $('.slide').empty();
                        $('.slide').append(this.controlsView);
                        $('.slide').fadeIn('slow');

                        $('#startLocal').click(function =>
                        {
                            $('#splashScreen').css({ opacity: '0.0' })
                            $('#startMenu').fadeOut('normal');
                            callback();
                        })
                    });


                });

            }, 1200); // articifal load delay
        } else
        {
            $('#splashScreen').remove();
            callback();
        }
    }

    display()
    {
        //$('#splashScreen').
    }


}