const passport = require('passport')

function initUser (app) {
  app.get('/', renderWelcome)
  app.get('/app/makecall', passport.authenticationMiddleware(), renderProfile)
  app.post('/login', passport.authenticate('local', {
    failureRedirect: '/'
  }),
  function(req,res){
    res.send({message:req.user.Agentnbr})
  })
}

function renderWelcome (req, res) {

  res.render('login')
}

function renderProfile (req, res) {
  console.log(req.user.Agentnbr)
  res.render('index',{'agentnbr':req.user.Agentnbr,'clientnbr':req.query.clientnbr})
}

module.exports = initUser
