var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var expressValidator = require('express-validator');
var session = require('express-session');
var flash = require('connect-flash');

var mongo = require('mongodb');
var mongoose = require('mongoose');

mongoose.connect('mongodb://root:123456@ds113580.mlab.com:13580/cpanel');
mongoose.connection;
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var multer = require('multer');

var index = require('./routes/index');
var users = require('./routes/users');
var categories = require('./routes/categories');
var posts = require('./routes/posts');
var products = require('./routes/products');
var sanphams = require('./routes/sanphams');
var cart = require('./routes/cart');
var app = express();



app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

app.use(require('connect-flash')());
app.use(function(req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

app.use(passport.initialize());
app.use(passport.session());
app.use(multer({ dest: './public/images/uploads' }).any());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser("_secret_"));
var MemoryStore = session.MemoryStore;

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))

app.use('/', index);
app.use('/users', users);
app.use('/categories', categories);
app.use('/posts', posts);
app.use('/products', products);
app.use('/sanphams', sanphams);
app.use('/cart', cart);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.locals.rutgon = function(text, length) {
    return text.substring(0, length);
}
app.locals.moment = require('moment');
app.listen(80);
console.log('Server is starting on port 80');

module.exports = app;