/**
 * Created by lbb on 2015/10/19.
 */
var mongoose = require("mongoose");
var UserSchema = require("../schemas/user")
var User = mongoose.model("User",UserSchema)

module.exports = User;