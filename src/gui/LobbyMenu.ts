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
        this.view = '<div style="text-align:center"> <h2>Game Lobbies </h2><span class="badge badge-success" id=' + this.CSS_ID.USER_COUNT_BOX.replace('#','') + '></span>' +
            '<table id=' + this.CSS_ID.LOBBY_TABLE.replace('#', '') + ' class="table table-striped table-bordered" > <thead>  <tr>  <th>Lobby</th>  <th>nPlayers</th>  <th>Locked</th>   <th>Join</th>  </tr>  </thead>  ' +
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
            $('#splashScreen').remove();
            $('#startMenu').fadeOut('normal');
            AssetManager.sounds["CursorSelect"].play();
        })

        $(this.CSS_ID.CREATE_BTN).click(function =>
        {
            $(this.CSS_ID.CREATE_LOBBY_POP_UP).modal('show');
            $(this.CSS_ID.CREATE_LOBBY_FORM_SUBMIT).click(function (e) =>
            {
                $(this.CSS_ID.CREATE_LOBBY_FORM_SUBMIT).unbind();
                var name = $(this.CSS_ID.CREATE_LOBBY_FORM + " #inputName").val();
                var playerCount = $(this.CSS_ID.CREATE_LOBBY_FORM + " #inputPlayers").val();
                this.lobbyRef.client_createGameLobby(name, playerCount);
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
            $(this.CSS_ID.LOBBY_TABLE).append(
           ' <tr><td>' + gameLobbies[gameLobby].name + '</td> ' +
           ' <td> ' + gameLobbies[gameLobby].numberOfPlayers + ' / ' + gameLobbies[gameLobby].players.length + ' </td>   ' +
           ' <td>' + gameLobbies[gameLobby].isPrivate + '</td> ' +
           ' <td><button class="btn btn-mini ' + this.CSS_ID.JOIN_BTN.replace('.', '') + '"  value=' + gameLobbies[gameLobby].id + ' type="button">Join this game lobby</button></td> ');
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