class LobbyMenu
{
    view: string;
    CSS_ID = {
        QUICK_PLAY_BTN: "quickPlay",
        LOBBY_TABLE : "lobbyList",
        JOIN_BTN : "join",
        CREATE_BTN : "create",
        INFO_BOX: "infoBox"
    } 

    constructor ()
    {
        this.view = '<div style="text-align:center"> <h2>Game Lobbies </h2>' +
            '<table id=' + this.CSS_ID.LOBBY_TABLE + ' class="table table-striped" > <thead>  <tr>  <th>Lobby</th>  <th>nPlayers</th>  <th>Locked</th>   </tr>  </thead>  '+
            '<tbody> <tr>  <td>001</td>  <td>Rammohan </td>  <td>Reddy</td> </tbody>   </table>' +
            '<p ' + this.CSS_ID.INFO_BOX + '></p>' +
            '<a class="btn btn-primary btn-large" id='+this.CSS_ID.QUICK_PLAY_BTN +' style="text-align:center">Quick Play</a>' + 
            '<a class="btn btn-primary btn-large" id='+this.CSS_ID.CREATE_BTN +' style="text-align:center">Create Lobby</a>' + 
            '<a class="btn btn-primary btn-large" id='+this.CSS_ID.JOIN_BTN +'style="text-align:center">Join Lobby</a></div>';
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
                AssetManager.sounds["CursorSelect"].play();             
            })

            $(this.CSS_ID.JOIN_BTN).click(function =>
            {
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
            this.bind();
            $('.slide').fadeIn('slow');

        });      
    }

    updatelobbies(lobbys)
    {
        //$(this.lobbyListCssId).append
    }

}