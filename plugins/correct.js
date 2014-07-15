var LogCycle = function() {
    var MAX_LINES = 20;
    var log = {};
    var logCycle = {
        push: function(channel, msg) {
            if(!log[channel]) {
                log[channel] = [];
            }
            log[channel].push(msg);
            if(log[channel].length > MAX_LINES) {
                log[channel].shift();
            }
        },
        get: function(channel) {
            return log[channel];
        }
    };
    return logCycle;
};
var logCycle = new LogCycle();
var correct = {
    events: {
        "message#": function(nick, channel, text) {
            //if(text.indexOf(courtesy.bot.name) !== -1 && text[text.length - 1] === "?") {
                //courtesy.bot.say(channel, "I'm a bot!");
            //}
            //regex to detect regexes
            //
<<<<<<< HEAD
            var hasRegex = /(s\/.*?\/.*)[\/|\W]/;
=======
            var hasRegex = /^(s\/.*?\/.*)\/+$/;
>>>>>>> 9aa25b95139269c53fa8f2d0ae53cffe7c289223
            try {
            var match = text.match(hasRegex);
                if(match) {
                    var replacement = match[1].split('/');
                    var correction = new RegExp(replacement[1]);
                    var log = logCycle.get(channel) || [];
                    for(var i = 0; i < log.length; i++) {
                        if(!hasRegex.test(log[i].text) && correction.test(log[i].text)) {
                            console.log('this matches stuff.');
                            correct.bot.say(channel, '<' + log[i].nick + '> ' + log[i].text.replace(correction, replacement[2]));
                            return;
                        }
                    }
                    correct.bot.say(channel, nick + ': That never happened!');

                }
            } catch(e) {
                correct.bot.say(channel, e.message);
            }
            logCycle.push(channel, {nick: nick, text: text });

        }
    }
};

module.exports = correct;
