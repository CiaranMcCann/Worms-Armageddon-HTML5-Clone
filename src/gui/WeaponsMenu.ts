/**
 * WeaponsMenu.js
 * This is the menu which slides out from the right side
 * Its shows the player all the infomation from their teams weapon manager.
 * It displays all the weapons + ammo and allows the user to select a weapon.
 *
 *  License: Apache 2.0
 *  author:  Ciar�n McCann
 *  url: http://www.ciaranmccann.me/
 */
///<reference path="../Main.ts"/>
///<reference path="../Game.ts"/>
///<reference path="../system/AssetManager.ts"/>
class WeaponsMenu
{
    htmlElement;
    isVisable;
    lastPlayer;
    cssId;

    constructor ()
    {
        this.cssId = "weaponsMenu";

        $('body').append("<div id=" + this.cssId + "></div>");
        this.htmlElement = $("#" + this.cssId);

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

    selectWeapon(weaponId) 
    {
        var weaponMgmt = GameInstance.getCurrentPlayerObject().getTeam().getWeaponManager();

        //Checks if the weapon has ammo to provide the html been hacked and a weaponid passed that doesn't have ammo
        if (weaponMgmt.checkWeaponHasAmmo(weaponId))
        {
            weaponMgmt.setCurrentWeapon(weaponId);
        }

    }

    toggle()
    {
        // If its still same players go no need to repopluate menu
        if (this.lastPlayer == GameInstance.currentPlayerIndex)
        {
            // do nothing
        } else
        {
            // populate
            var weaponMgmt = GameInstance.getCurrentPlayerObject().getTeam().getWeaponManager();

            ////TODO demo code
            //var tmp = [];
            //for (var i = 0; i < 8 * 4; i++)
            //{
            //    tmp.push({ img: Settings.REMOTE_ASSERT_SERVER + "data/images/bananabomb.png", name: "bannan", ammo: Utilies.random(0, 2) });
            //}

            
            this.populateMenu(weaponMgmt.getListOfWeapons());

            this.lastPlayer = GameInstance.currentPlayerIndex;
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
    populateMenu(listOfWeapons : BaseWeapon[])
    {
        var html = "<ul class = \"thumbnails\" >"

        for (var weapon in listOfWeapons)
        {
            var currentWeapon :BaseWeapon = listOfWeapons[weapon];
            var cssClassType = "ammo";

            html += "<li class=span1>";
            if (currentWeapon.ammo <= 0)
            {
                cssClassType = "noAmmo";
            }
            html += "<a  class=\"thumbnail "  +  cssClassType + "\" value=" + currentWeapon.name + " id=" + weapon +"><span class=ammoCount> " + currentWeapon.ammo + "</span><img src=" + currentWeapon.iconImageUrl + " alt=" + currentWeapon.name + "></a>";
            html += "</li>";
        }
        html += "</ul>";

        this.htmlElement.empty();
        this.htmlElement.append(html);

        var _this = this;
        $("#" +this.cssId + " a").click(function (){
            _this.selectWeapon( parseInt( $(this).attr('id') ) );
        });

    }


}
