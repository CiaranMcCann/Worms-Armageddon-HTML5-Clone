 module ServerSettings
{
    export var DEVELOPMENT_MODE = true;

}

//Hack
declare var exports: any;
if (typeof exports != 'undefined') {
  (module).exports = ServerSettings;
}
