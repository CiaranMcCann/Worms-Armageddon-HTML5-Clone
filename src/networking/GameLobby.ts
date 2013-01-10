class GameLobby
{
    players: number[];
    name: string;
    numberOfPlayers: number;


    constructor (name, numberOfPlayers)
    {
        this.name = name;
        this.players = [numberOfPlayers];
        this.numberOfPlayers = numberOfPlayers;
        console.log("Lobby number of players " + this.numberOfPlayers);


        //socket.emit('createdNewPlayerId', playerCount);
        //console.log(" New player has connected and has been assgined ID " + playerCount);


        //socket.on('addNewPlayerToGame', function (player)
        //{

        //    console.log(player);

        //});

    }

    addPlayer(userId)
    {
        console.log("Player " + userId + " added to gamelobby + " + this.name);
    }

}


declare var exports: any;
if (typeof exports != 'undefined') {
  (module).exports = GameLobby;
}
