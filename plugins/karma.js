var fs = require("fs");
var karmaStatus = {};

if(fs.existsSync("data/karma.json")) {
    karmaStatus = JSON.parse(fs.readFileSync("data/karma.json"));
}

var save = function() {
    fs.writeFileSync("data/karma.json", JSON.stringify(karmaStatus));
};

var karmaFactory = function(mention, karma, thanks) {
    return {
        mention: mention || 0,
        karma: karma || 0,
        thanks: thanks || 0
    };
};

var karma = {
    commands: {
        "karma": function(msg) {
            var text = msg.message;
            var args = text.split(" ");
            var nick = "";
            if(args.length > 1) {
                nick = args[1];
            }
            if(karmaStatus[nick]) {
                karma.bot.say(msg.channel, nick + " karma: " + karmaStatus[nick].karma);
                karma.bot.say(msg.channel, nick + " mentions: " + karmaStatus[nick].mention);
                karma.bot.say(msg.channel, nick + " thanks: " + karmaStatus[nick].thanks);
            } else {
                return nick + " has no known karma at the moment.";
            }
        }
    },
    events: {
        "names": function(channel, names) {
            console.log("NAMES reply");
            var nicks = Object.keys(names);
            for(var i = 0; i < nicks.length; i++) {
                if(!karmaStatus[nicks[i]]) {
                    karmaStatus[nicks[i]] = karmaFactory();
                }
            }
        },
        "nick": function(oldnick, newnick, channel, message) {
            if(!karmaStatus[newnick]) {
                karmaStatus[newnick] = karmaFactory();
            }
        },
        "join": function(channel, nick) {
            if(!karmaStatus[nick]) {
                karmaStatus[nick] = karmaFactory();
            }
        },
        "message#": function(nick, channel, text) {
            plusKarma = /\W*(\w+)\+\+/;
            minKarma = /\W*(\w+)\-\-/;
            mentionKarma = new RegExp("(" + Object.keys(karmaStatus).join("|") + ")");
            thanksKarma = new RegExp("thank|thnx|thx|merci");
            var plusTest = plusKarma.exec(text);
            var minTest = minKarma.exec(text);
            if(plusTest) {
                console.log(plusTest);
                if(karmaStatus[plusTest[1]]) {
                    karmaStatus[plusTest[1]].karma++;
                    karma.bot.say(channel, plusTest[1] + " karma: " + karmaStatus[plusTest[1]].karma + "(+1)");
                }
            }
            if(minTest) {
                console.log(minTest);
                if(karmaStatus[minTest[1]]) {
                    karmaStatus[minTest[1]].karma--;
                    karma.bot.say(channel, minTest[1] + " karma: " + karmaStatus[minTest[1]].karma + "(-1)");
                }

            }

            var mentionTest = mentionKarma.exec(text);
            if(mentionTest) {
                var thanksTest = thanksKarma.exec(text);
                if(thanksTest) {
                    karmaStatus[mentionTest[0]].thanks++;
                } else {
                    karmaStatus[mentionTest[0]].mention++;
                }
            }
            save();
        }
    }
};

module.exports = karma;
