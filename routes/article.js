/**
 * Created by lbb on 2015/10/19.
 */
var express = require("express");
var moment = require("moment-timezone");
var router = express.Router();
var Article = require("../models/Article");
var Clazz = require("../models/Clazz");
//var debug= require('debug')('personal_blog:article:sdaf');

router.get("/list", function (req, res, next) {
    Article.fetch(function (err, articles) {
        if (err)
            return next(err);

        articles.forEach(function (a) {
            a.meta._createAt = moment(a.meta.createAt).format("DD-MM-YYYY");
            a.meta.createAt = moment(a.meta.createAt).format("DD-MM-YYYY");
        });
        req.local.articles = articles;
        Article.fetchHotArticles(function(err,articles){
            if (err)
                return next(err);
            articles.forEach(function (a) {
                a.meta._createAt = moment(a.meta.createAt).format("DD-MM-YYYY");
                a.meta.createAt = moment(a.meta.createAt).format("DD-MM-YYYY");
            });
            req.local.hot_articles = articles
            Clazz.fetch(function (err, clazzes) {
                if (err)
                    return next(err);
                var _clazzes = clazzes;
                req.local.clazzes = clazzes;
                req.local._clazzes = _clazzes;
                res.render('article/list', req.local);
            })
        })


    });
});
router.get("/add", function (req, res, next) {
    Clazz.fetch(function (err, clazzes) {
        if (err)
            return next(err);
        else {
            req.local.clazzes = clazzes;
            res.render('article/add', req.local);
        }
    });
});
router.post("/add", function (req, res, next) {
    var article = req.body.article;
    if (!article)
        return next();
    article.keywords = req.body.keywords.split(/[;；\s]+/);
    var new_article = new Article({
        author: req.session.user._id,
        isOriginal: article.isOriginal,
        title: article.title,
        content: article.content,
        clazz: article.clazz,
        keywords: article.keywords
    });

    new_article.save(function (err) {
        if (err)
            return next(err);
        res.redirect("/article/detail/" + new_article._id)
    });

    //get current user id and save the article to db
})
router.get("/detail/:id", function (req, res, next) {
    Article.findById(req.params.id, function (err, articles) {
        if (err)
            return next(err);
        else if (!articles)
            return next();
        else {
            req.local.article = articles[0];
            req.local.article.meta._createAt = moment(articles[0].meta.createAt).format("DD-MM-YYYY");
            res.render("../views/article/detail", req.local, function (err, html) {
                if (err) {
                    return next(err);
                }
                res.send(html);
                res.end();

                articles[0].viewTime++;
                articles[0].save();
            });
        }
    });
});
//router.get("/detail/remove/:id", function (req, res, next) {
//    Article.removeById(req.params.id,function(err){
//        if(err)
//            console.log(err);
//        res.redirect("/article/list");
//    });
//});
module.exports = router;