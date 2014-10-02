var mongoose = require('mongoose');
var uristring = 'mongodb://oauth:oauth@linus.mongohq.com:10075/oauth';

mongoose.connect(uristring, function (err, res) {
  if (err) {
    console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
    console.log ('Succeeded connected to: ' + uristring);
  }
});


var express = require('express');
var bodyParser = require('body-parser');
var oauthserver = require('oauth2-server');



var app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.oauth = oauthserver({
  model: require('./model'),
  grants: ['authorization_code', 'password', 'refresh_token'],
  debug: false
});

app.all('/oauth/token', app.oauth.grant());

app.get('/', app.oauth.authorise(), function (req, res) {
  res.send('Authorized');
});

app.use(app.oauth.errorHandler());

app.listen(3000);