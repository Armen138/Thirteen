var irc = require("irc");
var commandHandler = require("./commandHandler");
var bot;

var thirteen = {
    server: "irc.freenode.net",
    name: "Thirteen",
    unregister: function(p) {
        for(var ircEvent in p.events) {
            bot.removeListener(ircEvent, p.events[ircEvent]);
        }
        for(var ircCommand in p.commands) {
            commandHandler.unregister(ircCommand);
        }
    },
    register: function(p) {
        for(var ircEvent in p.events) {
            bot.addListener(ircEvent, p.events[ircEvent]);
        }
        for(var ircCommand in p.commands) {
            commandHandler.register(ircCommand, p.commands[ircCommand]);
        }
        p.bot = bot;
    },
    connect: function(cfg) {
        bot = new irc.Client(thirteen.server, thirteen.name, cfg);
        bot.name = thirteen.name;
        bot.addListener("message#", function(from, to, text) {
            commandHandler({ nick: from, channel: to, message:text}, bot);
        });
    }
};

module.exports = thirteen;
