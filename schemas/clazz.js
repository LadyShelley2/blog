/**
 * Created by lbb on 2015/10/19.
 */
var mongoose = require("mongoose")
var Schema = mongoose.Schema
var ObjecctId = mongoose.ObjectId

var ClazzSchema = new Schema({
    desc:String,
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

ClazzSchema.pre('save',function(next){
    if(this.isNew){
        this.meta.createAt = Date.now();
    }
    else{
        this.meta.updateAt = Date.now();
    }
    next();
});

ClazzSchema.statics={
    fetch:function(cb) {
        return this
            .find({})
            .sort({'meta.createAt': 1})
            .exec(cb);
    },
    findById:function(id,cb){
        return this
            .find({_id:id})
            .exec(cb)
    }
}

module.exports = ClazzSchema;