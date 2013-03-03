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
///<reference path="../Main.ts"/>
///<reference path="../Game.ts"/>
///<reference path="../system/AssetManager.ts"/>
///<reference path="../system/Controls.ts"/>
class WeaponsMenu
{
    htmlElement;
    isVisable;
    cssId;

    constructor()
    {
        this.cssId = "weaponsMenu";

        $('body').append("<div id=" + this.cssId + "></div>");
        this.htmlElement = $("#" + this.cssId);

        var _this = this;
        $(window).keypress(function (event)
        {
            if (Client.isClientsTurn() && Controls.checkControls(Controls.toggleWeaponMenu, event.which))
            {
                _this.toggle();
            }
        });

        $('body').mousedown(function (event) =>
        {
            if (Client.isClientsTurn() && Controls.checkControls(Controls.toggleWeaponMenu, event.which))
            {
                this.toggle();
            }
        });

        $('body').on('contextmenu', "#" + this.cssId, function (e)
        {
            return false;
        });

        this.isVisable = false;
    }


    selectWeapon(weaponId)
    {
        var weaponMgmt = GameInstance.state.getCurrentPlayer().getTeam().getWeaponManager();

        //Checks if the weapon has ammo to provide the html been hacked and a weaponid passed that doesn't have ammo
        if (weaponMgmt.checkWeaponHasAmmo(weaponId))
        {
            weaponMgmt.setCurrentWeapon(weaponId);
            Client.sendImmediately(Events.client.ACTION, new InstructionChain("state.getCurrentPlayer.getTeam.getWeaponManager.setCurrentWeapon", [weaponId]));
        }
    }


    show()
    {
        this.htmlElement.show();
    }

    refresh()
    {
        var weaponMgmt = GameInstance.state.getCurrentPlayer().getTeam().getWeaponManager();
        this.populateMenu(weaponMgmt.getListOfWeapons());
    }

    toggle()
    {

        // populate
        this.refresh();
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
    populateMenu(listOfWeapons: BaseWeapon[])
    {
        var html = "<ul class = \"thumbnails\" >"

        for (var weapon in listOfWeapons)
        {
            var currentWeapon: BaseWeapon = listOfWeapons[weapon];
            var cssClassType = "ammo";

            if (currentWeapon.ammo <= 0)
            {
                cssClassType = "noAmmo";
                weapon = "-1";
            }

            html += "<li class=span1 id=" + weapon + ">";
            html += "<a  class=\"thumbnail " + cssClassType + "\" id=" + weapon + " value=" + currentWeapon.name + "  title= " + currentWeapon.name +"><span class=ammoCount> " + currentWeapon.ammo + "</span><img title= " + currentWeapon.name +" src=" + currentWeapon.iconImage.src + " alt=" + currentWeapon.name + "></a>";
            html += "</li>";
        }
        html += "</ul>";

        this.htmlElement.empty();
        this.htmlElement.append(html);


        var _this = this;
        $("#" + this.cssId + " a").click(function ()
        {
            var weaponId = parseInt($(this).attr('id'));

            if (weaponId == -1)
            {
                AssetManager.getSound("cantclickhere").play();
                return;
            }

            AssetManager.getSound("CursorSelect").play();
            _this.selectWeapon(weaponId);
            _this.toggle();
        });

    }


}
