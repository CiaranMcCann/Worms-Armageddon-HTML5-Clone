class SplashScreen
{

    constructor ()
    {
        //$(".splashScreen #loadIcon").
    }

    hide(callback)
    {   
        setTimeout(function ()
        {
            $('#splashScreen').fadeOut('normal');
            callback();

        }, 1000); // articifal load delay
      
    }

}