class SplashScreen
{

    constructor ()
    {
        //$(".splashScreen #loadIcon").
    }

    hide(callback)
    {   
       document.getElementById("splashScreen").parentNode.removeChild( document.getElementById("splashScreen"));
       callback();
    }

}