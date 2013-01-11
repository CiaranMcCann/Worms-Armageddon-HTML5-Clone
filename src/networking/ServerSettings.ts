 module ServerSettings
{
    export var DEVELOPMENT_MODE = true;
    export var MAX_PLAYERS_PER_LOBBY = 4;
    export var MAX_USERS = 1000;

}

//Hack
declare var exports: any;
if (typeof exports != 'undefined') {
  (module).exports = ServerSettings;
}
