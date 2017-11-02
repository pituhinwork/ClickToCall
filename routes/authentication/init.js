const passport = require('passport')
const bcrypt = require('bcrypt')
const LocalStrategy = require('passport-local').Strategy

const authenticationMiddleware = require('./middleware')

// Generate Password
const saltRounds = 10
const myPlaintextPassword = 'my-password'
const salt = bcrypt.genSaltSync(saltRounds)
const passwordHash = bcrypt.hashSync(myPlaintextPassword, salt)

var pg = require('pg')
var format = require('pg-format')
var PGUSER = 'svjwmybeoxaehv'
var PGDATABASE = 'd45316l6s97891'
var sha256 = require('sha256')

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

  // pg.connect('postgres://dqvxxrytnsuqdy:ea35c56c7fda4d60cbf081778534f1b5912768799992b2e6732fa0a4ca04be76@ec2-23-21-85-76.compute-1.amazonaws.com:5432/de758n566gf8v6',
  //   function(err,client,done){
  //   })


function findUser (username, callback) {
  var ageQuery = format('SELECT * from users WHERE email = %L',username)
  myClient.query(ageQuery, function (err, result) {
     if(err)  
      return callback(null)
     return callback(null, result.rows[0])
  })
}

passport.serializeUser(function (user, cb) {
  cb(null, user)
})

passport.deserializeUser(function (username, cb) {
  findUser(username.email, cb)
})

function initPassport () {
  
  passport.use(new LocalStrategy(
    { usernameField: 'email',    // define the parameter in req.body that passport can use as username and password
    passwordField: 'password'},
    (username, password, done) => {
      findUser(username, (err, user) => {
        if (err) {
          return done(err)
        }

        // User not found
        if (!user) {
          console.log('User not found')
          return done(null, false)
        }
        console.log('got user')
        if(user.active && user.password == sha256(password).toUpperCase())
          {
                   var payload = {id: user.id};
                   return done(null, user)
           } 
         else {	
                   return done(null,false)
               }                                                    
        
        // Always use hashed passwords and fixed time comparison

      })
    }
  ))

  passport.authenticationMiddleware = authenticationMiddleware
}

module.exports = initPassport
