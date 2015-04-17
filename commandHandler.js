var commands = {
    "help": function() {
        var help = [];
        var topic = "";
        for(topic in commands) {
            help.push(topic);
        }
        return "commands: " + help.join(", ");
    }
};

var commandHandler = function(msg, bot) {
    if(msg.message[0] === commandHandler.identifier) {
        var command = msg.message.split(" ")[0].substr(1);
        if(commands[command]) {
            try {
                var result = commands[command](msg);
                if(result) {
                    bot.say(msg.channel, result);
                }
            } catch(e) {
                bot.say('error executing command: ' + e.message);
            }
            return;
        }
    }
};

commandHandler.exists = function(command) {
    return !!commands[command];
};

commandHandler.register = function(command, handler) {
    if(handler) {
        commands[command] = handler;
    }
};

commandHandler.unregister = function(command) {
    delete commands[command];
};
commandHandler.identifier = "!";

module.exports = commandHandler;
