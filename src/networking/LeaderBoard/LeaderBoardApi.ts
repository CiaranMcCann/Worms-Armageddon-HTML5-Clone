declare var require;
declare var module;

var mongo = require('mongodb');
var Server = mongo.Server,
	Db = mongo.Db,
	BSON = mongo.BSONPure;
var curl = require('node-curl');

class LeaderBoardApi
{
    settings;
    db: any;

    constructor(settings)
    {
        this.settings = settings;

        //Setup server and connect to the database
        var server = new Server('localhost', 27017, {auto_reconnect: true});
        this.db = new Db(this.settings.database, server, {safe:false});
        this.db.open(function(err, db) => {
            if(!err) {
                console.log("Connected to " + this.settings.database + " database");
            }else{
                console.log("ERROR connecting to " + this.settings.database + " database");
            }
        });
    }

    updateUser(req,res)
    { 
        var authToken = req.params.token;

            this.findUsersIdByToken(authToken, function (userId) => {
                
                //if got userId from authToken
                if (userId)
                {
                    this.db.collection(this.settings.userTable, function (err, collection) => {

                        collection.findOne({ 'userId': userId }, function (err, item) => {

                            //TODO fix this up
                            if (item)
                            {
                                collection.update({ 'userId': userId }, { $inc: { "winCount": 1 } });
                                res.send("update");

                            } else
                            {
                                collection.insert({ 'userId': userId, 'winCount': 1 });
                                res.send({ 'userId': userId, 'winCount': 1 });
                            }
                        });

                    });
                } else
                {
                    //If we where unable to get the userId from the authToken
                     res.send({ 'Error': "Failed to auth" });
                }

            });

    }

    getLeaderBoard(req, res)
    {
        console.log(res);
        this.db.collection(this.settings.userTable, function(err, collection) => {
            collection.find().toArray(function(err, items) {
               res.jsonp(JSON.stringify(items));
            });
        });
    }

    //Given a authToken, it will retrive the userId of the authenetiated user
    findUsersIdByToken(authToken, callback)
    {
        var url = 'https://www.googleapis.com/plus/v1/people/me?key=' + this.settings.apiKey + '&access_token=' + authToken;
        //console.log(url);
        curl(url,  function(err) {
            
            //console.log(this.body);
            var userId = JSON.parse(this.body).id;
            callback(userId);
        });
    }

}

declare var exports: any;
if (typeof exports != 'undefined')
{
    (module).exports = LeaderBoardApi;
}