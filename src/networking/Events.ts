module Events
{
    export var lobby = {
        CREATE_GAME_LOBBY: "createLobby",
        UPDATE_USER_COUNT : "newUserConnected"
    }

    export var gameLobby = {
        PLAYER_JOIN: "playerJoin",
        UPDATE: "updateGameWorld",
        START_GAME_FOR_OTHER_CLIENTS: "startGameForOtherClients",
        START_GAME_HOST : "startGame"
    }

    export var client = {

        NEW_LOBBY_CREATED: "newLobbyCreated",
        UPDATE_ALL_GAME_LOBBIES: "updateAllGameLobbies",       
        ASSIGN_USER_ID: "assignId",
        ACTION : "Action"
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




