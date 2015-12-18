/**
 * Created by lbb on 2015/10/30.
 */
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var bodyParser = require('body-parser');
var upload =require('multer')({dest:"uploads/"});
var ueditor = require("ueditor");
var mongoose=require('mongoose');
var mongoStore=require('connect-mongo')(expressSession);
var moment=require('moment-timezone');

var siteSetting=require('./setting/site');
var user = require('./routes/user');
var article=require('./routes/article');
var clazz = require('./routes/clazz');
var index = require('./routes/index');

var app = express();


var DB_URL = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/';
DB_URL+=process.env.OPENSHIFT_APP_NAME || "personal_blog";

mongoose.connect(DB_URL);

moment.tz.setDefault("Asia/Shanghai");

//favicon
//app.use(favicon(__dirname + '/public/favicon.ico'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(expressSession({
    secret: siteSetting.siteName,
    resave:false,
    saveUninitialized:false,
    store:new mongoStore({
        url:DB_URL,
        collection: 'sessions'
    })
}));

app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
if(process.env.OPENSHIFT_DATA_DIR){
    app.use(express.static(process.env.OPENSHIFT_DATA_DIR));
}

//for ueditor
app.use("/ueditor/ue", ueditor(siteSetting.dataPath, function(req, res, next) {
    // ueditor 客户发起上传图片请求
    if(req.query.action === 'uploadimage'){
        var foo = req.ueditor;
        var imgname = req.ueditor.filename;
        var img_url = '/picture/ueditor/';
        res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
    }
    //  客户端发起图片列表请求
    else if (req.query.action === 'listimage'){
        var dir_url = '/picture/ueditor/';
        res.ue_list(dir_url);  // 客户端会列出 dir_url 目录下的所有图片
    }
    // 客户端发起其它请求
    else {

        res.setHeader('Content-Type', 'application/json');
        res.redirect('/ueditor/ueditor.config.json')
    }
}));


app.use(function(req,res,next){
    req.local={};
    req.local.user=req.session.user;
    req.local.siteSetting=require('./setting/site');
    console.log(req.local);
    next();
});

if(siteSetting.allNeedLogin){
    app.use(function(req,res,next){
        if(req.session.user){
            return next();
        }else{
            if(req.url==="/user/login" || req.url==="/user/register"){
                return next();
            }else{
                res.redirect('/user/login');
            }
        }
    });
}

app.use('/', index);
app.use('/user', user);
app.use('/article',article);
app.use('/clazz',clazz);
//app.use('/comment',comment);
//app.use('/staticHtml', staticHtml);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        req.local.message=err.message;
        req.local.error=err;
        res.render('error', req.local);
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    req.local.message=err.message;
    req.local.error=err;
    res.render('error', req.local);
});

module.exports = app;
