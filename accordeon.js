
/**
 * Module dependencies.
 */

var express = require('express'),
    routes =  require('./routes'),
    user = require('./routes/user'),
    http = require('http'),
    path = require('path');

var app = express(),
    formTokens = {};

var oneYear = 31557600000,
    clientCacheLimit = 0, //oneYear,
    domainStraighter = function(){
      return function(req, res){
        if(req.host == 'accordeonlesdenhaag.nl') res.redirect('http://www.accordeonlesdenhaag.nl' + req.path );
        else req.next();
      };
    };

app.configure(function(){
  app.set('port', process.env.PORT);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(require('less-middleware')(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public'), { maxAge: clientCacheLimit } ));
  app.use(express.favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());

  app.use(express.cookieParser('sweet sensemilla'));
  app.use(express.session());

  app.use(domainStraighter());

  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.configure('production', function() {});

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

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
