/**
 * Created by lbb on 2015/10/30.
 */
var express = require("express");
var router = express.Router();
var Article = require("../models/Article")
var Clazz = require("../models/Clazz")

router.get("/",function(req,res,next){
    res.redirect("/article/list");
})
router.get("/home",function(req,res,next){
    Article.fetchNewestArticle(function(err,articles){
        if(err)
            return next(err);
        else
        {
           req.local.articles = articles;
           res.render('../views/home',req.local);
        }
    });
});
router.get("/about",function(req,res,next){
    res.render("../views/about",req.local);
})
module.exports = router;
