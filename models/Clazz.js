/**
 * Created by lbb on 2015/10/19.
 */
var mongoose = require("mongoose");
var ClazzSchema = require("../schemas/clazz.js")
var Clazz = mongoose.model("Clazz",ClazzSchema)

module.exports = Clazz;