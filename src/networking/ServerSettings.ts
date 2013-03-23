 module ServerSettings
{
    export var DEVELOPMENT_MODE = false;
    export var MAX_PLAYERS_PER_LOBBY = 4;
    export var MAX_USERS = 1000;
    export var LEADERBOARDS_API = "http://96.126.111.211/";

}

//Hack
declare var exports: any;
if (typeof exports != 'undefined') {
  (module).exports = ServerSettings;
}
