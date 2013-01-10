class GameLobby
{
    players: number[];
    name: string;
    numberOfPlayers: number;
    isPrivate: bool;

    //TODO LOOK AT THIS
    // https://github.com/learnboost/socket.io#rooms
    // LOOK AT IT

    constructor (name, numberOfPlayers)
    {
        this.name = name;
        this.isPrivate = false;
        this.players = [];
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
        console.log("Player " + userId + " added to gamelobby " + this.name);
    }

}


declare var exports: any;
if (typeof exports != 'undefined') {
  (module).exports = GameLobby;
}
