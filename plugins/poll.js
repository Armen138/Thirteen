var current = {};

var create = function() {
    return {
        poll: null,
        up: 0,
        down: 0
    };
};

var poll = {
    commands: {
        poll: function(msg) {
            if(current[msg.channel] && current[msg.channel].poll) {
                poll.bot.say(msg.channel, poll.commands.cancelpoll(msg));
            }
            if(!current[msg.channel]) {
                current[msg.channel] = create();
            }
            current[msg.channel].poll = msg.message.substr(msg.message.indexOf(" ") + 1);
            current[msg.channel].up = 0;
            current[msg.channel].down = 0;
            return "Polling: " + current[msg.channel].poll;

        },
        cancelpoll: function(msg) {
            if(!current[msg.channel] || !current[msg.channel].poll) {
                return "There is no poll. You can start one using the !poll command.";
            }
            var report =  "Ending poll: '" + current[msg.channel].poll + "', " + current[msg.channel].up + " in favor, " + current[msg.channel].down + " against.";
            current[msg.channel] = create();
            return report;
        },
        vote: function(msg) {
            if(!current[msg.channel] || !current[msg.channel].poll) {
                return "No poll! What are you voting for?";
            }
            if(msg.message.indexOf("+") !== -1) {
                current[msg.channel].up++;
                return msg.nick + " voted in favor of '" + current[msg.channel].poll + "'";
            }
            if(msg.message.indexOf("-") !== -1) {
                current[msg.channel].down++;
                return msg.nick + " voted against '" + current[msg.channel].poll + "'";
            }
        },
        currentpoll: function(msg) {
            if(!current[msg.channel] || !current[msg.channel].poll) {
                return "There is no poll. You can start one using the !poll command.";
            }
            return "Current poll: '" + current[msg.channel].poll + "', " + current[msg.channel].up + " in favor, " + current[msg.channel].down + " against.";
        }
    }

};

module.exports = poll;
