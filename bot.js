var irc = require("irc");
var commandHandler = require("./commandHandler");
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded());
app.engine(".jade", require("jade").__express);
app.set('views', __dirname + '/web/templates');
app.set("view engine", "jade");
var bot;

var webRegistry = {};

var thirteen = {
    server: "irc.freenode.net",
    name: "Thirteentest",
    unregister: function(p) {
        for(var ircEvent in p.events) {
            bot.removeListener(ircEvent, p.events[ircEvent]);
        }
        for(var ircCommand in p.commands) {
            commandHandler.unregister(ircCommand);
        }
    },
    register: function(p) {
        if(p.events) {
            for(var ircEvent in p.events) {
                bot.addListener(ircEvent, p.events[ircEvent]);
            }
        }
        if(p.commands) {
            for(var ircCommand in p.commands) {
                commandHandler.register(ircCommand, p.commands[ircCommand]);
            }
        }
        if(p.web) {
            for(var webPath in p.web) {
                console.log(webPath);
                app.get( "/" + webPath, p.web[webPath]);
                if(p.name) {
                    if(!webRegistry[p.name]) {
                        webRegistry[p.name] = [];
                    }
                    webRegistry[p.name].push(webPath);
                }
            }
        }
        p.bot = bot;
        p.commandHandler = commandHandler;
    },
    connect: function(cfg) {
        bot = new irc.Client(cfg.server || thirteen.server, thirteen.name, cfg);
        bot.name = thirteen.name;
        bot.addListener("message#", function(from, to, text) {
            commandHandler({ nick: from, channel: to, message:text}, bot);
        });
        bot.addListener("join", function() {
            bot.connected = true;
        });
    }
};
app.get("/plugins", function(request, res) {
    res.end(JSON.stringify(webRegistry));
});
app.get("/", function(req, res) {
    res.render("index", {
            "plugins": Object.keys(webRegistry)
        });
});
app.use(express.static(__dirname + '/web'));
app.listen(9991);
module.exports = thirteen;
