/**
 * Created by lbb on 2015/10/19.
 */
var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
    username:String,
    nickname:String,
    password:String,
    email:String,
    meta:{
        createAt:{
            type:Date,
            default:Date.now()
        },
        updateAt:{
            type:Date,
            default:Date.now()
        }

    }
});

UserSchema.pre('save',function(next){
    if(this.isNew){
        this.meta.createAt = this.meta.updateAt = Date.now();
    }
    else{
        this.meta.updateAt = Date.now();
    }
    next();
});

UserSchema.statics = {
    fetch:function(cb){
        return this
            .find({})
            .exec(cb);
    },
    findById:function(id,cb){
        return this
            .findOne({_id:id})
            .exec(cb)
    },
    findByNameOrEmail:function(data,cb){
        return this
            .findOne({$or:[{username:data},{email:data}]})
            .exec(cb)
    }
}

module.exports = UserSchema;