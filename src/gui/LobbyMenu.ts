/**
 *  
 * LobbyMenu.js
 *
 *  License: Apache 2.0
 *  author:  Ciarán McCann
 *  url: http://www.ciaranmccann.me/
 */
///<reference path="../Game.ts"/>
///<reference path="../networking/Lobby.ts"/>

class LobbyMenu
{
    private view: string;
    CSS_ID = {
        QUICK_PLAY_BTN: "#quickPlay",
        LOBBY_TABLE: "#lobbyList",
        JOIN_BTN: "#join",
        CREATE_BTN: "#create",
        INFO_BOX: "#infoBox",
        CREATE_LOBBY_POP_UP: "#createLobby",
        CREATE_LOBBY_FORM: "#createLobbyForm",
        CREATE_LOBBY_FORM_SUBMIT : "#submit"
    } 
    private lobbyRef: Lobby;

    constructor (lobby : Lobby)
    {
        this.lobbyRef = lobby;
        this.view = '<div style="text-align:center"> <h2>Game Lobbies </h2>' +
            '<table id=' + this.CSS_ID.LOBBY_TABLE.replace('#','') + ' class="table table-striped table-bordered" > <thead>  <tr>  <th>Lobby</th>  <th>nPlayers</th>  <th>Locked</th>   <th>Join</th>  </tr>  </thead>  '+
            '<tbody></tbody></table>' +
            '<p ' + this.CSS_ID.INFO_BOX.replace('#','') + '></p>' +
            '<a class="btn btn-primary btn-large" id='+this.CSS_ID.QUICK_PLAY_BTN.replace('#','') +' style="text-align:center">Quick Play</a>' + 
            '<a class="btn btn-primary btn-large" id='+this.CSS_ID.CREATE_BTN.replace('#','') +' style="text-align:center">Create Lobby</a>' + 
            '</div>';
    }

    bind()
    {
            $(this.CSS_ID.QUICK_PLAY_BTN).click(function =>
            {
                $(this.CSS_ID.QUICK_PLAY_BTN).unbind();
                $('#splashScreen').remove();
                $('#startMenu').fadeOut('normal');
                AssetManager.sounds["CursorSelect"].play();            
            })

            $(this.CSS_ID.CREATE_BTN).click(function =>
            {
                $(this.CSS_ID.CREATE_LOBBY_POP_UP).modal('show');
                $(this.CSS_ID.CREATE_LOBBY_FORM_SUBMIT).click(function (e) =>
                {
                    var name = $(this.CSS_ID.CREATE_LOBBY_FORM + " #inputName").val();
                    var playerCount = $(this.CSS_ID.CREATE_LOBBY_FORM + " #inputPlayers").val();
                    this.lobbyRef.client_createGameLobby(name, playerCount);
                    AssetManager.sounds["CursorSelect"].play();
                });
                AssetManager.sounds["CursorSelect"].play();
                
            })

            //TODO include the join game button beside the lobby listtings
            //$(this.CSS_ID.JOIN_BTN).click(function =>
            //{

            //    AssetManager.sounds["CursorSelect"].play();  
            //    this.lobbyRef.joinGameLobby(           
            //})
    }

    displayMessage(msg)
    {
        $(this.CSS_ID.INFO_BOX).empty();
        $(this.CSS_ID.INFO_BOX).append(msg);
    }

    show(callback)
    {
        $('.slide').fadeOut('normal', function =>
        {
            $('.slide').empty();
            $('.slide').append(this.view);

            this.updateLobbyListUI(this.lobbyRef);
            
            this.bind();
            $('.slide').fadeIn('slow');

        });      
    }

    updateLobbyListUI(lobby : Lobby)
    {
        $(this.CSS_ID.LOBBY_TABLE).empty()
        var gameLobbies : GameLobby[] = lobby.getGameLobbies();
        for (var i = 0; i < gameLobbies.length; i++)
        {          
             $(this.CSS_ID.LOBBY_TABLE).append(
            ' <tr><td>' + gameLobbies[i].name +  '</td> ' + 
            ' <td> '+ gameLobbies[i].numberOfPlayers +' </td>   ' +
            ' <td>'+ gameLobbies[i].isPrivate +'</td> ' +
            ' <td><button class="btn btn-mini" type="button">Join this game lobby</button></td> ');
        }
    }

}