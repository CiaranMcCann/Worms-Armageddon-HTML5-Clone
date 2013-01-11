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
        START_GAME_HOST : "startGame",
        ASSIGN_USER_ID: "assignId",
        START_GAME_FOR_OTHER_CLIENTS: "startGameForOtherClients",

        game :  {

            UPDATE: "updateGameWorld",
         }
    }

    export var server = {


    }

 
}

// Hack 
declare var exports: any;
declare var module: any;
if (typeof exports != 'undefined')
{
    (module).exports = Events;
}




