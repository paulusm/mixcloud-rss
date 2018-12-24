/*!
* MixCloud RSS Converter
*
* @package    MixCloudRSS
* @subpackage app
* @copyright  Copyright (c) 2012 Andrew Weeks http://meloncholy.com
* @license    MIT licence. See http://meloncholy.com/licence for details.
* @version    0.1.1
*/

"use strict";

var config = require("konphyg")(__dirname + "/config/");
// There must be a better way to do this.
global.appPath = __dirname;
global.mcSettings = { app: config("app") };
if (global.mcSettings.app.url.substr(-1) != "/") global.mcSettings.app.url += "/";

var express = require("express");
var mcache = require('memory-cache');

var cache = (duration) => {
    return (req, res, next) => {
      let key = '__express__' + req.originalUrl || req.url
      let cachedBody = mcache.get(key)
      if (cachedBody) {
        res.send(cachedBody)
        return
      } else {
        res.sendResponse = res.send
        res.send = (body) => {
          mcache.put(key, body, duration * 1000);
          res.sendResponse(body)
        }
        next()
      }
    }
  }

var routes = {};
routes.site = require("./routes/site");
routes.feed = require("./routes/feed");

var app = module.exports = express()


app.set("env", global.mcSettings.mode);
app.set("views", __dirname + "/views");
app.set("view engine", "jade");
//app.use(express.bodyParser());
//app.use(express.methodOverride());
// Put static before router to check for real files first, a la .htaccess
app.use(express.static(__dirname + "/public"));
//app.use(app.router);

//app.use(express.logger());
//app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

//prod
//app.use(express.errorHandler());

//app.listen(3000);

// Routes
// Make sure you have a favicon or this will request user favicon.ico from MixCloud
app.get("/:user/test", routes.feed.test);
app.get("/:user", cache(60*60*8), routes.feed.index);
app.get("/", routes.site.index);

app.listen(8000);

//app.listen(config("app").localPort);
//console.log("We're up on port %d in %s mode.", app.address().port, app.settings.env);
