/**
 * Created by lbb on 2015/10/20.
 */
var mongoose = require("mongoose");
var CommentSchema = require("../schemas/comment.js")
var Comment = mongoose.model("Comment",CommentSchema)

module.exports = Comment;