
module Events
{
    export var lobby = {

        CREATE_GAME_LOBBY: "createLobby",

    }

    export var gameLobby = {

        PLAYER_JOIN: "playerJoin",
    }

    export var client = {

        NEW_LOBBY_CREATED: "newLobbyCreated",
        JOIN_GAME_LOBBY: "joinGameLobby"
    }

    export var server = {


    }

    export var gameplay = {


    }
}

// Hack 
declare var exports: any;
if (typeof exports != 'undefined') {
  (module).exports = Events;
}




