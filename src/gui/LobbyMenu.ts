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
        LOBBY_TABLE: "#lobbyList tbody",
        CREATE_BTN: "#create",
        JOIN_BTN: ".join",
        INFO_BOX: "#infoBox",
        CREATE_LOBBY_POP_UP: "#createLobby",
        CREATE_LOBBY_FORM: "#createLobbyForm",
        CREATE_LOBBY_FORM_SUBMIT: "#submit",
        USER_COUNT_BOX: "#userCount"
    }
    private lobbyRef: Lobby;

    constructor (lobby: Lobby)
    {
        this.lobbyRef = lobby;
        this.view = '<div style="text-align:center"> <h2>Game Lobbies </h2><span class="label label-success" style="float:left;padding:3px;">Connected users   <span class="badge badge-inverse" id=' + this.CSS_ID.USER_COUNT_BOX.replace('#','') + '></span></span><br>' +
            '<table id=' + this.CSS_ID.LOBBY_TABLE.replace('#', '') + ' class="table table-striped table-bordered" > <thead>  <tr>  <th>Lobby</th>  <th>Num Players</th>  <th> Status </th>   <th>Join a game lobby</th>  </tr>  </thead>  ' +
            '<tbody></tbody></table>' +
            '<div class="alert alert-success" id="' + this.CSS_ID.INFO_BOX.replace('#', '') + '"></div>' +
            '<a class="btn btn-primary btn-large" id=' + this.CSS_ID.QUICK_PLAY_BTN.replace('#', '') + ' style="text-align:center">Quick Play</a>' +
            '<a class="btn btn-primary btn-large" id=' + this.CSS_ID.CREATE_BTN.replace('#', '') + ' style="text-align:center">Create Lobby</a>' +
            '</div>';
       
    }

    updateUserCountUI(userCount)
    {
        $(this.CSS_ID.USER_COUNT_BOX).empty()
        $(this.CSS_ID.USER_COUNT_BOX).append(userCount);
    }

    bind()
    {
        $(this.CSS_ID.QUICK_PLAY_BTN).click(function =>
        {
            $(this.CSS_ID.QUICK_PLAY_BTN).unbind();
            AssetManager.sounds["CursorSelect"].play();
            this.lobbyRef.client_joinQuickGame();
        })

        $(this.CSS_ID.CREATE_BTN).click(function =>
        {
            $(this.CSS_ID.CREATE_LOBBY_POP_UP).modal('show');

            var levelSelector :  SettingsMenu  = new SettingsMenu();
            $('.modal-body').prepend(levelSelector.getView());
             levelSelector.bind(function () =>{ 
                         AssetManager.sounds["CursorSelect"].play();   
                        
                 });

            $(this.CSS_ID.CREATE_LOBBY_FORM_SUBMIT).click(function (e) =>
            {
                $(this.CSS_ID.CREATE_LOBBY_FORM_SUBMIT).unbind();
                var name = $(this.CSS_ID.CREATE_LOBBY_FORM + " #inputName").val();
                var playerCount = $(this.CSS_ID.CREATE_LOBBY_FORM + " #inputPlayers").val();
                this.lobbyRef.client_createGameLobby(name, playerCount, levelSelector.getLevelName());
                AssetManager.sounds["CursorSelect"].play();
            });
            AssetManager.sounds["CursorSelect"].play();

        })
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
            this.updateUserCountUI(this.lobbyRef.userCount);
            this.displayMessage(" Select a game lobby or create one ");

            this.bind();
            $('.slide').fadeIn('slow');

        });
    }

    updateLobbyListUI(lobby: Lobby)
    {
        $(this.CSS_ID.LOBBY_TABLE).empty()
        var gameLobbies: GameLobby[] = lobby.getGameLobbies();
        for (var gameLobby in gameLobbies)
        {
            var lob: GameLobby = gameLobbies[gameLobby];
            var disableButton = "";
            if (lob.contains(Client.id) || lob.isFull())
            {
                disableButton = 'disabled="disabled"';
            }

            var status = "Waitting";
            var buttonText = " Join game ";
            if (lob.isFull())
            {
                status = "Playing";

            }

            $(this.CSS_ID.LOBBY_TABLE).append(
           ' <tr><td>' + gameLobbies[gameLobby].name + '</td> ' +
           ' <td> ' + gameLobbies[gameLobby].getNumberOfPlayers() + ' / ' + gameLobbies[gameLobby].getPlayerSlots() + ' </td>   ' +
           ' <td>' + status + '</td> ' +
           ' <td><button ' + disableButton +' class="btn btn-mini btn-success ' + this.CSS_ID.JOIN_BTN.replace('.', '') + 
           '"  value=' + gameLobbies[gameLobby].id + ' type="button"> ' + buttonText  + '</button></td> ');
        }
        $(this.CSS_ID.LOBBY_TABLE).append('</tbody></table>');

        var _this = this;
        $(this.CSS_ID.JOIN_BTN).click(function ()
        {
            //  alert("dfdf");
            AssetManager.sounds["CursorSelect"].play();
            _this.lobbyRef.client_joinGameLobby($(this).attr('value'));
        })
    }

}