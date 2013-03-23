/**
 *  
 * Leaderboards.js is a RESETful api for the leaderboards information
 *
 *  License: Apache 2.0
 *  author:  Ciarán McCann
 *  url: http://www.ciaranmccann.me/
 */
///<reference path="../../Game.ts"/>
///<reference path="../../system/Utilies.ts"/>


var access_token;

function googlePlusSignIn(authResult) 
 {

       $(LobbyMenu.CSS_ID.NICKNAME_PICK_UP).modal('hide');
      if (authResult['access_token']) 
      {
    
        // Successfully authorized
          access_token = authResult['access_token'];

          if (Client.socket)
          {
              Client.socket.emit(Events.lobby.GOOGLE_PLUS_LOGIN, access_token);
          }

      } else if (authResult['error']) 
      {
          console.log(authResult['error']);

        // There was an error.
        // Possible error codes:
        //   "access_denied" - User denied access to your app
        //   "immediate_failed" - Could not automatially log in the user
        // console.log('There was an error: ' + authResult['error']);

      }

    }


function googlePlusdisconnectUser(access_token) {
  var revokeUrl = 'https://accounts.google.com/o/oauth2/revoke?token=' +
      access_token;

  // Perform an asynchronous GET request.
  $.ajax({
    type: 'GET',
    url: revokeUrl,
    async: false,
    contentType: "application/json",
    dataType: 'jsonp',
    success: function(nullResponse) {
        Notify.display("Google+ Token Revoked", "All your user data has now been removed from the database and this app no longer has permission to use your Google+ sign to rank you in the leaderboard",11000);
    },
    error: function(e) {

         Notify.display("Unsuccessful", "Somthing went wrong and we couldn't revoke the token try this <a href=https://plus.google.com/apps >https://plus.google.com/apps</a>. Though your information has been removed from the leaderboards",11000, Notify.levels.error);
      // Handle the error
      // console.log(e);
      // You could point users to manually disconnect if unsuccessful
      // https://plus.google.com/apps
    }
  });
}


  