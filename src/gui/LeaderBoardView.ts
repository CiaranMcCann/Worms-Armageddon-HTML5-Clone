/**
 *  
 * LeaderboardsView.js manages updating the leaderboards view and all that shit
 *
 *  License: Apache 2.0
 *  author:  Ciarán McCann
 *  url: http://www.ciaranmccann.me/
 */
///<reference path="../Game.ts"/>

class LeaderBoardView
{
    private view: string;

    static CSS_ID = {
        LEADERBOARDS_TABLE: "#leaderBoardsTable tbody"
    }

    constructor()
    {
        this.view = '<div id="leaderBoards" style="display:none">' +
          '<table id=' + LeaderBoardView.CSS_ID.LEADERBOARDS_TABLE.replace('#', '') + ' class="table table-striped table-bordered" > ' +
          '<thead>  <tr>  <th>Player</th>  <th>Wins/Loss</th> </tr>  </thead>  ' +
          '<tbody></tbody></table>' +
          '</div>';
    }

    getView()
    {
        return this.view;
    }

    update()
    {
        $(LeaderBoardView.CSS_ID.LEADERBOARDS_TABLE).empty()

        var func = function (json) => {

            var json = JSON.parse(json);

            for (var item in json)
            {

                $.ajax({
                    url: "https://www.googleapis.com/plus/v1/people/100821494565115211032/?key=AIzaSyA1aZhcIhRQ2gbmyxV5t9pGK47hGsiIO7U",
                    dataType: 'jsonp',
                    success: function (userData)
                    {
                        $(LeaderBoardView.CSS_ID.LEADERBOARDS_TABLE).append(' <tr> <td><img width=30 height=30 src=' + userData["image"]["url"] + ' /> <span> ' + userData["displayName"] + '</td> <td> ' + json[item]["winCount"] + '</span></td>  </tr>');
                    }
                });

            }

            $(LobbyMenu.CSS_ID.LOBBY_TABLE).append('</tbody></table>');

        }

        $.ajax({
            url: Settings.LEADERBOARD_API_URL + '/getLeaderBoard',
            dataType: 'jsonp',
            error: function (xhr, status, error)
            {
                alert(error);
            },
            success: func
        });



    }