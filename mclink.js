var req = require("request");
var lnk = "http://www.mixcloud-downloader.com/s/mixcloud/dubmission/dubmission-1022";

req.get(lnk,function(err,res,data){
    if(err){
        console.log(err);
    }
    else{
        href = data.match(/mb-1\" href=\"([^"]*)\">/);
        console.log(href[1]);
    }
})