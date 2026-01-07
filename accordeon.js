
/**
 * Module dependencies.
 */

var express = require('express'),
    routes =  require('./routes'),
    user = require('./routes/user'),
    http = require('http'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    methodOverride = require('method-override'),
    morgan = require('morgan'),
    favicon = require('serve-favicon'),
    errorhandler = require('errorhandler');

var app = express(),
    formTokens = {};

var oneYear = 31557600000,
    clientCacheLimit = 0, //oneYear,
    domainStraighter = function(){
      return function(req, res, next){
        if(req.host == 'accordeonlesdenhaag.nl') res.redirect('http://www.accordeonlesdenhaag.nl' + req.path );
        else next();
      };
    };

var port = process.env.PORT || 3000;

app.set('port', port);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(require('less-middleware')(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: clientCacheLimit } ));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());

app.use(cookieParser('sweet sensemilla'));
app.use(session({
  secret: 'sweet sensemilla',
  resave: false,
  saveUninitialized: false
}));

app.use(domainStraighter());

app.locals.generateToken = function(formName) {
  var str = Math.random();
  formTokens[str] = new Date;
  return str;
};

app.get('/', routes.nl.index);
app.get('/nl/', routes.nl.index);
app.get('/en/', routes.en.index);

for(var i in routes.nl){
  app.get('/nl/' + i, routes.nl[i]);
}
for(var i in routes.en){
  app.get('/en/' + i, routes.en[i]);
}

if (process.env.NODE_ENV === 'development') {
  app.use(errorhandler());
}

app.listen(port, function(){
  console.log("Express server listening on port " + port);
});
