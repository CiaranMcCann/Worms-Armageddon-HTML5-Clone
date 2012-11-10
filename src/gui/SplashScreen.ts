class SplashScreen
{

    loadPercentage;
    div : HTMLDivElement;

    constructor (parentElement : HTMLElement)
    {
        this.div = <HTMLDivElement>document.createElement('div');
        this.div.style.cssText = " position: absolute; left: 0px; top: 0px; background: #111111; width: 100%; height:100%; z-index: 1";
        this.div.id = "SplashScreen";
       // this.div.innerHTML = " <h1> Worms HTMl5</h1> ";
        parentElement.appendChild(this.div);

        var loaderImage = document.createElement('div');
        loaderImage.style.cssText += "	background: url(data/img/worms/cdrom.png) no-repeat 0px 0px; background-position:center center;width:160px; height:160px;position: absolute;left: 45%;top: 45%;";
        this.div.appendChild(loaderImage);

    }

    show()
    {


    }

    hide(callback)
    {   
        this.div.style.cssText = "display: none";
        callback();
    }

}