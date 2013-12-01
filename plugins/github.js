var fs = require("fs");
var https = require("https");
var interval = 10; // minutes

var watchList = [];

if(fs.existsSync("data/github.json")) {
    watchList = JSON.parse(fs.readFileSync("data/karma.json"));
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
            path: "/repos/" + where.target + "/" + what + "?since=" + (new Date(watch.last).toISOString()),
            method: "GET",
            headers: {
                "User-Agent": "Thirteen IRC Bot, freenode, #13tanks, ##gamedev, @Armen138"
            }
        };
        console.log(options);
        var req = https.request(options, function(res) {
            var data = "";
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
        });
        req.end();
        console.log("getting " + where);

    }
};

var watch = function() {
    if(!watch.last) {
        watch.last = Date.now() - (interval * 60 * 1000);
    }
    var report = function(where, commits) {
        for(var i = 0; i < commits.length; i++) {
            var msg = "[" + where.target + "] commit by " + commits[i].commit.committer.name + ": " + commits[i].commit.message + " ( " + commits[i].url + " )";
            console.log(msg);
            if(gitHub.bot && gitHub.bot.connected) {
                gitHub.bot.say(where.channel, msg);
            }
        }
    };
    for(var i = 0; i < watchList.length; i++) {
        api.get("commits", watchList[i], report);
    }
    watch.last = Date.now();
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
            }
        }
    }
};

watch();

module.exports = gitHub;
