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
        JOIN_GAME_LOBBY: "joinGameLobby",
        UPDATE_ALL_GAME_LOBBIES: "updateAllGameLobbies",
        START_GAME : "startGame"
    }

    export var server = {


    }

    export var gameplay = {


    }
}

// Hack 
declare var exports: any;
declare var module: any;
if (typeof exports != 'undefined')
{
    (module).exports = Events;
}




