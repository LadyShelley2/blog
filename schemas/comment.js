/**
 * Created by lbb on 2015/10/19.
 */
var mongoose = require("mongoose");
var Schema  = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;;

var CommentSchema = new mongoose.Schema({
    author:{type:ObjectId,ref:"User"},
    article:{type:ObjectId,ref:"Article"},
    comment:{type:ObjectId,ref:"Comment"},
    content:String,
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        }
    }
});

CommentSchema.statics={
    fetch:function(cb){
        return this
            .find({})
            .sort({'meta.createAt':-1})
        exec(cb)
    },
    findById:function(id,cb){
        return this
            .find({_id:id})
        exec(cb)
    }
}

module.exports = CommentSchema;