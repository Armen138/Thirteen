var http = require("http");
var url = require("url");
var xml = require("xml2js");
var RSS = function(command, feed) {

    var postResult = function(res, msg) {
        var doc = "";
        res.on("data", function(data) {
            //console.log("---DATA---");
            //console.log("" + data);
            doc += data;
            //xml.parseString(data, function(err, result) {
                //console.log(JSON.stringify(result));
            //});
        });
        res.on("end", function() {
            xml.parseString(doc, function(err, result) {
                //console.log(JSON.stringify(result));
                if(result && result.rss) {
                    console.log(result.rss.channel[0].item[0].title + ": " + result.rss.channel[0].item[0].link);
                    rss.bot.say(msg.channel, result.rss.channel[0].item[0].title + ": " + result.rss.channel[0].item[0].link);
                } else {
                    rss.bot.say("Unable to fetch item from RSS feed!");
                }
            });
        });
    };
    var readRSS = function(msg) {
        var feedLocation = url.parse(feed);
        //console.log(feedLocation.hostname);
        //console.log(feedLocation.pathname);
        http.get({
            host: feedLocation.hostname,
            port: 80,
            path: feedLocation.pathname
        }, function(res) {
            postResult(res, msg);
        }).on("error", function(e) {
          console.log("Error reading feed: " + e.message);
        });
    };

    var rss = {
        commands: {}
    };
    rss.commands[command] = readRSS;

    return rss;
};

module.exports = RSS;
