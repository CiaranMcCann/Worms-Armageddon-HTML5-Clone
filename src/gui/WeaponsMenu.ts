/**
 * WeaponsMenu.js
 * This is the menu which slides out from the right side
 * Its shows the player all the infomation from their teams weapon manager.
 * It displays all the weapons + ammo and allows the user to select a weapon.
 *
 *  License: Apache 2.0
 *  author:  Ciarán McCann
 *  url: http://www.ciaranmccann.me/
 */
class WeaponsMenu
{
    htmlElement;
    isVisable;
    lastPlayer;

    constructor ()
    {
        var cssId = "weaponsMenu";

        $('body').append("<div id=" + cssId + "></div>");
        this.htmlElement = $("#" + cssId);

        var _this = this;
        $(window).keypress(function (event)
        {
            if (event.which == 101)
            {
                _this.toggle();
            }
        });

        this.isVisable = false;
        this.lastPlayer = -1;
    }

    toggle()
    {
        // If its still same players go no need to repopluate menu
        if (this.lastPlayer == Game.currentPlayer)
        {
            // do nothing
        } else
        {
            // populate

            //TODO demo code
            var tmp = [];
            for (var i = 0; i < 8 * 4; i++)
            {
                tmp.push({ img: "data/img/bananabomb.png", name: "bannan", ammo: Utilies.random(0, 10) });
            }

            this.populateMenu(tmp);

            this.lastPlayer = Game.currentPlayer;
        }


        var moveAmountInPx;

        if (this.isVisable)
        {
            moveAmountInPx = "0px";
            this.isVisable = false;
        } else
        {
            moveAmountInPx = "-275px";
            this.isVisable = true;
        }


        this.htmlElement.animate({
            marginLeft: moveAmountInPx,
        }, 400);
    }

    //Fills the menu up with the various weapon items
    populateMenu(listOfWeapons)
    {
        var html = "<ul class = \"thumbnails\" >"

        for (var weapon in listOfWeapons)
        {
            var currentWeapon = listOfWeapons[weapon];

            html += "<li class=span1>";
            html += "<a class=\"thumbnail\" value=" + currentWeapon.name + "><span class=ammoCount> " + currentWeapon.ammo + "</span><img src=" + currentWeapon.img + " alt=" + currentWeapon.name + "></a>";
            html += "</li>";
        }
        html += "</ul>";

        this.htmlElement.empty();
        this.htmlElement.append(html);

    }


}
