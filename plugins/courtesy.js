var courtesy = {
    events: {
        "join": function(channel, nick) {
            courtesy.bot.say(channel, "Greetings, " + nick + ", chapter1 is available at http://13tanks.com/chapter1");
        },
        "message#": function(nick, channel, text) {
            if(text.indexOf(courtesy.bot.name) !== -1 && text[text.length - 1] === "?") {
                courtesy.bot.say(channel, "I'm a bot!");
            }
        }
    }
};

module.exports = courtesy;
