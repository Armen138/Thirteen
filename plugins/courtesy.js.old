var courtesy = {
    events: {
        "message#": function(nick, channel, text) {
            if(text.indexOf(courtesy.bot.name) !== -1 && text[text.length - 1] === "?") {
                courtesy.bot.say(channel, "I'm a bot!");
            }
        }
    }
};

module.exports = courtesy;
