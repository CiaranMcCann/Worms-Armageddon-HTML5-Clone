class GameLobby
{
    players: number[];
    name: string;


    constructor (name = "default lobby")
    {
        //socket.emit('createdNewPlayerId', playerCount);
        //console.log(" New player has connected and has been assgined ID " + playerCount);


        //socket.on('addNewPlayerToGame', function (player)
        //{

        //    console.log(player);

        //});

    }

    addPlayer(userId)
    {

    }

}

declare var exports: any;
if (typeof exports != 'undefined') {
  (module).exports = GameLobby;
}
