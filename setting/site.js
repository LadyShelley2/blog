/**
 * Created by lbb on 2015/10/25.
 */
var path= require("path")
var siteSetting ={}
siteSetting.siteName = "个人博客"
siteSetting.allNeedLogin = false;

siteSetting.dataPath=process.env.OPENSHIFT_DATA_DIR
    || path.join(__dirname, '../','public');

module.exports=siteSetting;