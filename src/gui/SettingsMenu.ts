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

    CSS_ID = {
        MAP_LIST_DIV: "#maps"
    }

    constructor()
    {

        this.view = '<div id="myCarousel" class="carousel slide" style="background: -webkit-linear-gradient(top,  #242a4a 0%,#201610 100%);"><div class="carousel-inner">';
                    

        for (var map in Maps)
        {
           this.view += this.addMapItem(Maps[map]);
        }

        this.view += ' <a class="left carousel-control" href="#myCarousel" data-slide="prev">‹</a>' +
                   ' <a class="right carousel-control" href="#myCarousel" data-slide="next">›</a></div>';


                //      <div class="item">
                //    <img src="assets/img/bootstrap-mdo-sfmoma-01.jpg" alt="">
                //    <div class="carousel-caption">
                //      <h4>First Thumbnail label</h4>
                //      <p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.</p>
                //    </div>
                //  </div>
                //  <div class="item active">
                //    <img src="assets/img/bootstrap-mdo-sfmoma-02.jpg" alt="">
                //    <div class="carousel-caption">
                //      <h4>Second Thumbnail label</h4>
                //      <p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.</p>
                //    </div>
                //  </div>
                //  <div class="item">
                //    <img src="assets/img/bootstrap-mdo-sfmoma-03.jpg" alt="">
                //    <div class="carousel-caption">
                //      <h4>Third Thumbnail label</h4>
                //      <p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.</p>
                //    </div>
                //  </div>
                //</div>

  // <form class="bs-docs-example form-horizontal" id="createLobbyForm" name="createLobbyForm">
  //          <div class="control-group">
  //            <label class="control-label" for="inputName">Lobby Name</label>
  //            <div class="controls">
  //              <input type="text" id="inputName" placeholder="Lobby Name">
  //            </div>
  //          </div>
  //          <div class="control-group">
  //            <label class="control-label" for="inputPlayers">Number Players</label>
  //            <div class="controls">
  //                <select id="inputPlayers" placeholder=" Number Players">
  //                    <option>2</option>
  //                    <option>3</option>
  //                    <option>4</option>
  //                </select>
  //            </div>
  //          </div>       
  //</form></div>

    }

    addMapItem(map : any)
    {
        var item: String = '<div class="item"><img  style="width:100%;height:300px" src="{2}" alt="">' +
                            '<div class="carousel-caption"><h4>{0}</h4>' +
                            '<p>{1}</p></div></div>';

        item = item.format(map.name, map.info, map.smallImage);
        return item;
    }

    bind()
    {
        $('.carousel').carousel({
            interval: false
        });
    }
    

    getView()
    {
        return this.view;
    }

}