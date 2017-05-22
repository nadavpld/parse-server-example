// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');
var MongoClient = require('mongodb').MongoClient;

var api = new ParseServer({
  databaseURI: 'mongodb://heroku_brv90mt5:68jeug151flv5deflfu8sgscrd@ds137121.mlab.com:37121/heroku_brv90mt5',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'learnguage',
  masterKey: process.env.MASTER_KEY || 'kkn12345', //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse',  // Don't forget to change to https if needed
  liveQuery: {
    classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
  }
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function(req, res) {
  res.status(200).send('dream of being a website.  Please star the parse-server repo on GitHub!');
});

app.get('/api/image', function(req, res) {
  // get pictures from db for user id
  // return the pictures
  var result = null;
  var code = 0;
  MongoClient.connect('mongodb://heroku_brv90mt5:68jeug151flv5deflfu8sgscrd@ds137121.mlab.com:37121/heroku_brv90mt5', function(err, db) {
    if(err != null) {
        result = {'error' : 'Database Error'};
        code = 500;
    } else {
      var collection = db.collection('Images');
      collection.find({}, function(err, dbResult) {
        if(err != null) {
          result = {'error' : 'Database Error'};
          code = 500;
        } else {
          result = dbResult;
          code = 200;
        }
      });
    }
  });
  while(true) {
    if(result != null) {
      res.status(code).json(result);
      return;
    }
  }
});

app.post('/api/image', function(request, response) {
    var croppedImage = request.body;
    // save the cropped Image in the database
});

app.get('/api/user', function(req, res) {
  // get pictures from db for user id
  // return the pictures
  res.status(200).send('API check');
});

app.post('/api/user', function(request, response) {
    var user = request.body;
    // save the cropped Image in the database
});

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);
