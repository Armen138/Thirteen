var moment = require("moment");
var fs = require("fs");
var nickStatus = {};

if(fs.existsSync("data/seen.json")) {
    nickStatus = JSON.parse(fs.readFileSync("data/seen.json"));
}

var save = function() {
    fs.writeFileSync("data/seen.json", JSON.stringify(nickStatus));
};

var seen = {
    events: {
        join: function(channel, nick) {
            nickStatus[nick] = {
                message: nick + " is here, silly",
                time: Date.now()
            };
            save();
        },
        part: function(channel, nick, reason) {
            nickStatus[nick] = {
                message: nick + " left %t. Reason: " + reason,
                time: Date.now()
            };
            save();
        },
        quit: function(nick, reason) {
            nickStatus[nick] = {
                message: nick + " quit %t. Reason: " + reason,
                time: Date.now()
            };
            save();
        },
        kick: function(channel, nick, by, reason) {
            nickStatus[nick] = {
                message: nick + " was kicked by " + by + "  %t. Reason: " + reason,
                time: Date.now()
            };
            save();
        }
    },
    commands: {
        seen: function(msg) {
            var nick = msg.message.split(" ")[1];
            if(nickStatus[nick]) {
                var time = moment(nickStatus[nick].time).fromNow();
                return nickStatus[nick].message.replace("%t", time);
            }
            return "I don't know " + nick + ".";
        }
    }
};

module.exports = seen;
