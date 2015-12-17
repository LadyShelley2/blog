/**
 * Created by lbb on 2015/10/21.
 */
var express = require("express")
var router = express.Router()
var Clazz = require("../models/Clazz")
var Article = require("../models/Article")
router.get("/add", function (req, res, next) {
    Clazz.fetch(function (err, clazzes) {
        if (err)
            next(err);

        //获取每个分类的文章篇数
        //无法传到前台
        //clazzes.forEach(function(c){
        //    Article.countByClazz(c._id,function(err,count){
        //        if(err)
        //            console.log(err);
        //        c.meta._count = count.toString();
        //        console.log(c);
        //    })
        //});
        req.local.clazzes = clazzes;
        res.render("../views/clazz/add.jade", req.local);
    });
});
router.post("/add", function (req, res, next) {
    var new_clazz = req.body.newClazz;
    var newClazz = new Clazz({desc: new_clazz});
    newClazz.save(function (err) {
        if (err)
            return next(err);
        Clazz.fetch(function (err, clazzes) {
            if (err)
                next(err);
            req.local.clazzes = clazzes;
            res.render("../views/clazz/add.jade", req.local);
        });
    })
});

module.exports = router;