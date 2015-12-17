/**
 * Created by lbb on 2015/10/30.
 */
var express = require("Express");
var router = express.Router();
var User = require("../models/User");

router.get("/login",function(req,res,next){
    res.render("../views/user/login",req.local);
})

router.post("/login",function(req,res,next){
    var username = req.body.username;
    User.findByNameOrEmail(username,function(err,user){
        if(err)
            res.send(err);
        else if(!user)
            res.send("The username does not exist");
        else if(req.body.password!=user.password){
            console.log("No this user!");
            return;
        }
        else
        {
            //console.log("Log in successfully!");
            req.local.user = req.session.user = user;
            res.redirect("/");
        }
    })
})

router.get("/register",function(req,res,next){
    res.render("user/register",req.local);
})

router.post("/register",function(req,res,next){
    var user_ = req.body.user;
    if(user_.password!=user_.password_confirm){
        res.send("两次密码输入不同");
    }
    else {
        var new_user = new User({
            username: user_.username,
            nickname: user_.nickname,
            password: user_.password,
            email: user_.email
        });
        new_user.save(function (err) {
            if (err)
                return next(err);
            else
            {
                req.session.user = new_user;
                res.redirect("/");
            }
        })
    }
})
router.get("/logout",function(req,res,next){
    delete req.session.user;
    res.redirect("/article/list");
});
module.exports = router;