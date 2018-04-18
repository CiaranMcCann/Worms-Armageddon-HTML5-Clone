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
///<reference path="../networking/LeaderBoard/GooglePLus.ts"/>
///<reference path="LeaderBoardView.ts"/>

class LobbyMenu
{
    private view: string;
    static CSS_ID = {
        QUICK_PLAY_BTN: "#quickPlay",
        LOBBY_TABLE: "#lobbyList tbody",
        CREATE_BTN: "#create",
        JOIN_BTN: ".join",
        INFO_BOX: "#infoBox",
        CREATE_LOBBY_POP_UP: "#createLobby",
        NICKNAME_PICK_UP: "#nickname",
        CREATE_LOBBY_FORM: "#createLobbyForm",
        CREATE_LOBBY_FORM_SUBMIT: "#submit",
        USER_COUNT_BOX: "#userCount",
        LEADERBOARDS_TABLE: "#leaderBoards"
    }
    private lobbyRef: Lobby;
    private leaderBoardView: LeaderBoardView;

    constructor(lobby: Lobby)
    {
        this.lobbyRef = lobby;
        this.leaderBoardView = new LeaderBoardView();

        this.view = '<span class="label label-success" style="float:left;padding:3px;text-align:center;">Connected users   <span class="badge badge-inverse" id=' + LobbyMenu.CSS_ID.USER_COUNT_BOX.replace('#', '') + '></span></span><br>';

        this.view += '<div class="navbar" id="onlineMenu">' +
              '<div class="navbar-inner">' +
                '  <div class="nav-collapse collapse navbar-responsive-collapse">' +
                   ' <ul class="nav">' +
                      '<li class="active"><a href="#" value="#lobbies">Game Lobbies</a></li>' +
                      '<li><a href="#"  value="#leaderBoards">Leaderboards</a></li>' +

                   ' </ul>' +
                   ' <ul class="nav pull-right">' +
                    ' <li><a href="#"  value="#profile">Profiles</a></li>' +
                    '</ul></div></div></div></div>';

        this.view += ' <div style="text-align:center" id="tabContainer" >';


        this.view += '<div id="lobbies"><div style="overflow-y:scroll;max-height:235px">' +
            '<table id=' + LobbyMenu.CSS_ID.LOBBY_TABLE.replace('#', '') + ' class="table table-striped table-bordered" style="margin-bottom:0px" > <thead>  <tr>  <th>Game Lobby</th>  <th>Number of Players</th>  <th> Status </th>   <th>Join</th>  </tr>  </thead>  ' +
            '<tbody></tbody></table></div><br>' +
            '<div class="alert alert-success" id="' + LobbyMenu.CSS_ID.INFO_BOX.replace('#', '') + '"></div>' +
            '<a class="btn btn-primary btn-large" id=' + LobbyMenu.CSS_ID.QUICK_PLAY_BTN.replace('#', '') + ' style="text-align:center">Quick Play</a>' +
            '<a class="btn btn-primary btn-large" id=' + LobbyMenu.CSS_ID.CREATE_BTN.replace('#', '') + ' style="text-align:center">Create Lobby</a>' +
            '</div>';

        this.view += this.leaderBoardView.getView();

        this.view += this.leaderBoardView.getProfileView();

        this.view += '</div>';

    }


    updateUserCountUI(userCount)
    {
        $(LobbyMenu.CSS_ID.USER_COUNT_BOX).empty()
        $(LobbyMenu.CSS_ID.USER_COUNT_BOX).append(userCount);
    }

    bind()
    {
        
        $('#googlePlusdisconnectUser').click(function ()
        {
            googlePlusdisconnectUser(access_token);
        });

        var _this = this;
        $('#onlineMenu a').click(function (e)
        {
            e.preventDefault();

            _this.leaderBoardView.update();
            //this.leaderBoardView.update();
            //Changes the menu css to give user feedback
            $('.nav').children().removeClass('active');
            $(this).parent().addClass('active');

            //Hides all other divs and displays the one we want
            $($(this).attr('value')).show();
            $($(this).attr('value')).siblings().hide();
        })

        $(LobbyMenu.CSS_ID.QUICK_PLAY_BTN).click(function ()
        {
            $(LobbyMenu.CSS_ID.QUICK_PLAY_BTN).unbind();
            AssetManager.getSound("CursorSelect").play();
            this.lobbyRef.client_joinQuickGame();
        })

        $(LobbyMenu.CSS_ID.CREATE_BTN).click( function()
        {
            $(LobbyMenu.CSS_ID.CREATE_LOBBY_POP_UP).modal('show');

            var levelSelector: SettingsMenu = new SettingsMenu();

            if ($('#mapSelector').length == 0)
            {
                $('.modal-body').prepend(levelSelector.getView());
                levelSelector.bind(function ()  {
                    AssetManager.getSound("CursorSelect").play();

                });
            }

            $(LobbyMenu.CSS_ID.CREATE_LOBBY_FORM_SUBMIT).click(function (e) 
            {
                $(LobbyMenu.CSS_ID.CREATE_LOBBY_FORM_SUBMIT).unbind();
                var name = $(LobbyMenu.CSS_ID.CREATE_LOBBY_FORM + " #inputName").val();
                var playerCount = $(LobbyMenu.CSS_ID.CREATE_LOBBY_FORM + " #inputPlayers").val();
                this.lobbyRef.client_createGameLobby(name, playerCount, levelSelector.getLevelName());
                AssetManager.getSound("CursorSelect").play();
            });
            AssetManager.getSound("CursorSelect").play();

        })
    }

    displayMessage(msg)
    {
        $(LobbyMenu.CSS_ID.INFO_BOX).empty();
        $(LobbyMenu.CSS_ID.INFO_BOX).append(msg);
    }

    show(callback)
    {
        $('.slide').fadeOut('normal', function ()
        {
            $('.slide').empty();
            $('.slide').append(this.view);

            $(LobbyMenu.CSS_ID.NICKNAME_PICK_UP).modal('show');

            this.updateLobbyListUI(this.lobbyRef);
            this.updateUserCountUI(this.lobbyRef.userCount);
            this.displayMessage(" Select a game lobby or create one ");

            this.bind();
            $('.slide').fadeIn('slow');

        });
    }

    updateLobbyListUI(lobby: Lobby)
    {
        $(LobbyMenu.CSS_ID.LOBBY_TABLE).empty()
        var gameLobbies: GameLobby[] = lobby.getGameLobbies();
        for (var gameLobby in gameLobbies)
        {
            var lob: GameLobby = gameLobbies[gameLobby];
            var disableButton = "";
            if (lob.contains(Client.id) || lob.status == GameLobby.LOBBY_STATS.GAME_IN_PLAY)
            {
                disableButton = 'disabled="disabled"';
            }

            var status = "Waitting";
            var buttonText = " Join game ";
            if (lob.status == GameLobby.LOBBY_STATS.GAME_IN_PLAY)
            {
                status = "Playing";

            }

            $(LobbyMenu.CSS_ID.LOBBY_TABLE).append(
           ' <tr><td>' + gameLobbies[gameLobby].name + '</td> ' +
           ' <td> ' + gameLobbies[gameLobby].getNumberOfPlayers() + ' / ' + gameLobbies[gameLobby].getPlayerSlots() + ' </td>   ' +
           ' <td>' + status + '</td> ' +
           ' <td><button ' + disableButton + ' class="btn btn-mini btn-success ' + LobbyMenu.CSS_ID.JOIN_BTN.replace('.', '') +
           '"  value=' + gameLobbies[gameLobby].id + ' type="button"> ' + buttonText + '</button></td> ');
        }
        $(LobbyMenu.CSS_ID.LOBBY_TABLE).append('</tbody></table>');

        var _this = this;
        $(LobbyMenu.CSS_ID.JOIN_BTN).click(function ()
        {

            AssetManager.getSound("CursorSelect").play();
            _this.lobbyRef.client_joinGameLobby($(this).attr('value'));
        })
    }

}