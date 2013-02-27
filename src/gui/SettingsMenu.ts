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
///<reference path="../system/Utilies.ts"/>

class SettingsMenu
{
    view;
    levelName;

    CSS_ID = {
        MAP_LIST_DIV: "#maps"
    }

    constructor()
    {
        //default selected map
        this.levelName = Maps.priates.name;

        this.view = '<h1 style="text-align: center">Select a Map</h1><p> <div class="row-fluid" style="text-align: center"><ul class="thumbnails"></p>';                 

        for (var map in Maps)
        {
           this.view += this.addMapItem(Maps[map],map);
        }

        this.view += '</ul></div><p style="text-align: center"> All map images were sourced from <a href="http://wmdb.org/">http://wmdb.org/</a></p>';
    }

    addMapItem(map : any, name)
    {
        var item: String = '<li class="span4" style="width:30%"><a href="#" class="thumbnail" id={1}>' +
                           '<img style="width: 160px; height: 80px;" src={0}> </a></li>';

        item = item.format(AssetManager.getImage(map.smallImage).src,name);
        return item;
    }

    bind(callback)
    {
        var _this = this;
        $('a.thumbnail').click(function()
        {
            var levelId = $(this).attr('id');
            $('a.thumbnail').css({ "background": "white" });
            $(this).css({ "background": "yellow" });
            _this.levelName = levelId;
            Game.map = new Map(Maps[levelId]);
            callback();

        });
    }
    
    getLevelName()
    {
        return this.levelName;
    }

    getView()
    {
        return this.view;
    }

}