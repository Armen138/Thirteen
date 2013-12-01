var fs = require("fs");
var https = require("https");
var interval = 5; // minutes

var watchList = [];

if(fs.existsSync("data/github.json")) {
    watchList = JSON.parse(fs.readFileSync("data/github.json"));
}

var save = function() {
    fs.writeFileSync("data/github.json", JSON.stringify(watchList));
};

var api = {
    get: function(what, where, callback) {
        var url = api.url + where + "/" + what;
        var options = {
            hostname: "api.github.com",
            port: 443,
            path: "/repos/" + where.target + "/" + what + "?since=" + (new Date(where.last).toISOString()),
            method: "GET",
            headers: {
                "User-Agent": "Thirteen IRC Bot, freenode, #13tanks, ##gamedev, @Armen138",
                "If-None-Match": where.etag
            }
        };
        var req = https.request(options, function(res) {
            where.last = new Date(res.headers.date).getTime();
            where.etag = res.headers.etag;
            var data = "";
            if(res.statusCode === 200) {
                res.on("data", function(chunk) {
                    data += chunk;
                });

                res.on("end", function() {
                    try {
                        callback(where, JSON.parse(data));
                    } catch(e) {
                        console.log("GITHUB API ERROR: " + e.message, data);
                    }
                });
            } else {
                //304, not changed. Doesn't count against rate limit.
                //console.log("Github API returned status code: " + res.statusCode);
            }
        });
        req.end();
        //console.log("getting " + where);

    }
};

var watch = function() {
    var report = function(where, commits) {
        if(commits.length > 3) {
            commits = commits.slice(0, 3);
        }
        for(var i = 0; i < commits.length; i++) {
            var msg = "[" + where.target + "] commit by " + commits[i].commit.committer.name + ": " + commits[i].commit.message + " ( " + commits[i].url + " )";
            //console.log(msg);
            if(gitHub.bot && gitHub.bot.connected) {
                gitHub.bot.say(where.channel, msg);
            }
        }
    };
    for(var i = 0; i < watchList.length; i++) {
        if(!watchList[i].last) {
            watchList[i].last = Date.now() - (interval * 60 * 1000);
        }
        api.get("commits", watchList[i], report);
    }

    setTimeout(watch, interval * 60 * 1000);
};

var gitHub = {
    commands: {
        "gh": function(msg) {
            var args = msg.message.split(" ");
            if(args.length !== 3) {
                return "Usage: !gh command target - commands: watch, unwatch";
            }
            var verb = args[1];
            var target = args[2];
            var i = 0;
            switch(verb) {
                case "watch":
                    for(i = 0; i < watchList.length; i++) {
                        if(watchList[i].target === target) {
                            return "I'm already watching that.";
                        }
                    }
                    watchList.push({
                        target: target,
                        channel: msg.channel
                    });
                    save();
                    return "Now watching: " + target;
                case "unwatch":
                    for(i = 0; i < watchList.length; i++) {
                        if(watchList[i].target === target) {
                            watchList.splice(i, 1);
                            save();
                            return "No longer watching: " + target;
                        }
                    }
                    return "I wasn't watching that.";
                case "help":
                    return "Usage: !gh command target - commands: watch, unwatch";
            }
        }
    }
};

watch();

module.exports = gitHub;
