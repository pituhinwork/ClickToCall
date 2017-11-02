var path = require('path');
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var twilio = require('twilio');
var VoiceResponse = twilio.twiml.VoiceResponse;
var config = require('../config');


// Create a Twilio REST API client for authenticated requests to Twilio
var client = twilio(config.accountSid, config.authToken);

const passport = require('passport')
const session = require('express-session')
const pgSession = require('connect-pg-simple')(session)








const app = express()

// Configure application routes
module.exports = function(app) {
// app.use(bodyParser());
   app.use(bodyParser.urlencoded({
        extended: true,
    }));


    
    

    var pg = require('pg')
var PGUSER = 'svjwmybeoxaehv'
var PGDATABASE = 'd45316l6s97891'

    var config = {
  port: 5432,
  ssl : 'true',
  host:'ec2-54-83-48-188.compute-1.amazonaws.com',
  user: PGUSER, // name of the user account
  database: PGDATABASE, // name of the database
  max: 10, // max number of clients in the pool
  password: '816eb1cac75dc998299c0f650dd0435faca00ac278308d59feb6d79d0d5eb105',
  idleTimeoutMillis: 3000000 // how long a client is allowed to remain idle before being closed
}

var pool = new pg.Pool(config)
var myClient



pool.connect(function (err, client, done) {
  if (err) console.log(err)
    myClient = client;
  done()
})

    require('./authentication').init(app)

    app.use(session({
    store: new pgSession({
        pool : pool,                // Connection pool 
        tableName : 'session'   // Use another table-name than the default "session" one 
    }),
    secret: 'secret',
    resave: false,
    saveUninitialized: false
    }))

    app.use(passport.initialize())
    app.use(passport.session())

    require('./user').init(app)
    require('./note').init(app)
    // Set Jade as the default template engine
    app.set('view engine', 'jade');

    // Express static file middleware - serves up JS, CSS, and images from the
    // "public" directory where we started our webapp process
    app.use(express.static(path.join(process.cwd(), 'public')));

    // Parse incoming request bodies as form-encoded
 

    // Use morgan for HTTP request logging
    app.use(morgan('combined'));
    
    // Home Page with Click to Call

    // Handle an AJAX POST request to place an outbound call
    app.post('/call', function(request, response) {
        // This should be the publicly accessible URL for your application
        // Here, we just use the host for the application making the request,
        // but you can hard code it or use something different if need be
        var salesNumber = request.body.salesNumber;
        var url = 'http://' + request.headers.host + '/outbound/' + encodeURIComponent(salesNumber)

        var options = {
            to: request.body.phoneNumber,
            from: request.body.outgoing,
            url: url,
        };
        // Place an outbound call to the user, using the TwiML instructions
        // from the /outbound route
        client.calls.create(options)
          .then((message) => {
            console.log(message.responseText);
            response.send({
                message: 'Thank you! We will be calling you shortly.',
            });
          })
          .catch((error) => {
            console.log(error);
            response.status(500).send(error);
          });
    });

    // Return TwiML instuctions for the outbound call
    app.post('/outbound/:salesNumber', function(request, response) {
        var salesNumber = request.params.salesNumber;
        var twimlResponse = new VoiceResponse();

        twimlResponse.say('Thanks for contacting our sales department. Our ' +
                          'next available representative will take your call. ',
                          { voice: 'alice' });

        twimlResponse.dial(salesNumber);

        response.send(twimlResponse.toString());
    });


};