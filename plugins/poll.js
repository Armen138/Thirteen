var current = {
    poll: null,
    up: 0,
    down: 0
};

var poll = {
    commands: {
        poll: function(msg) {
            if(current.poll) {
                poll.bot.say(msg.channel, poll.commands.cancelpoll());
            }
            current.poll = msg.message.substr(msg.message.indexOf(" ") + 1);
            current.up = 0;
            current.down = 0;
            return "Polling: " + current.poll;

        },
        cancelpoll: function(msg) {
            if(!current.poll) {
                return "There is no poll. You can start one using the !poll command.";
            }
            var report =  "Ending poll: '" + current.poll + "', " + current.up + " in favor, " + current.down + " against.";
            current.poll = null;
            current.up = 0;
            current.down = 0;
            return report;
        },
        vote: function(msg) {
            if(!current.poll) {
                return "No poll! What are you voting for?";
            }
            if(msg.message.indexOf("+") !== -1) {
                current.up++;
                return msg.nick + " voted in favor of '" + current.poll + "'";
            }
            if(msg.message.indexOf("-") !== -1) {
                current.down++;
                return msg.nick + " voted against '" + current.poll + "'";
            }
        },
        currentpoll: function(msg) {
            if(!current.poll) {
                return "There is no poll. You can start one using the !poll command.";
            }
            return "Current poll: '" + current.poll + "', " + current.up + " in favor, " + current.down + " against.";
        }
    }

};

module.exports = poll;
