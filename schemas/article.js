/**
 * Created by lbb on 2015/10/19.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var ArticleSchema = new mongoose.Schema({
    author: {type: ObjectId, ref: "User"},
    isOriginal: {
        type: Boolean,
        default: true
    },
    title: String,
    content: String,
    clazz: {type: ObjectId, ref: "Clazz"},
    keywords: [{type: ObjectId, ref: "Keyword"}],
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    },
    viewTime: {
        type: Number,
        default: 0
    },
    like: {
        type: Number,
        default: 0
    },
    keywords: [{type: String}]
});

ArticleSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = Date.now();
        this.viewTime = 0;
        this.like = 0;
    }
    else {
        this.meta.updateAt = Date.now();
    }

    next();
});

ArticleSchema.statics = {
    fetch: function (cb) {
        var result = this
            .find({})
            .sort({'meta.createAt': -1})
            .exec(cb);
        return result;
    },
    fetchNewestArticle: function (cb) {
        var result = this
            .find({})
            .sort({'meta.createAt': -1})
            .limit(3)
            .exec(cb);
        return result;
    },
    findById: function (id, cb) {
        return this
            .find({_id: id})
            .populate('clazz')
            .exec(cb)
    },
    countByClazz:function(id,cb){
        return this
            .count({clazz:id},cb)
    },
    fetchHotArticles:function(cb){
        return this
            .find({})
            .sort({viewTime:-1})
            .limit(10)
            .exec(cb)
    }
    //removeById: function (id,cb) {
    //    return this
    //        .remove({_id: id},cb)
    //}
}
module.exports = ArticleSchema;