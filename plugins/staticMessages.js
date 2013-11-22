var fs = require("fs");
var messages = {
};

if(fs.existsSync("data/alias.json")) {
    messages = JSON.parse(fs.readFileSync("data/alias.json"));
}

var save = function() {
    fs.writeFileSync("data/alias.json", JSON.stringify(messages));
};



var makeAlias = function(command, args) {
    messages[command] = args;
    var alias = args[0];
    var chain = {};
    while(messages[alias]) {
        console.log("check: " + alias);
        if(alias === command || chain[alias]) {
            console.log("circular alias: " + command);
            return false;
        }
        chain[alias] = true;
        alias = messages[alias][0];
    }
    save();
    return function(msg) {
        var text = msg.message.split(" ");
        text.shift();
        msg.message = "!" + args.join(" " ) + " " + text.join(" ");
        handler.commandHandler(msg, handler.bot);
    };
};

var handler = {
    "name": "Static Messages",
    "commands": {
        "alias": function(msg) {
            var text = msg.message;
            var args = text.split(" ");
            args.shift();
            var command = args.shift();
            if(handler.commandHandler.exists(command)) {
                return "That command is already in use.";
            }
            console.log("command alias: " + command);
            var alias = makeAlias(command, args);
            if(alias) {
                handler.commandHandler.register(command, alias);
                return "Alias recorded for " + command;
            } else {
                return "Circular alias, aborting.";
            }
        },
        "say": function (msg) {
            var txt = msg.message.split(" ");
            txt.shift();
            txt = txt.join(" ");
            return txt;
        }
    },
    "web": {
        "messages": function(request, respond) {
            respond.end(JSON.stringify(messages));
        }
    }
};

var handleCommand = function(msg) {
    //handler.commands[msg] = function() {
        //return messages[msg];
    //};
    handler.commands[msg] = makeAlias(msg, messages[msg]);
};

for(var msg in messages) {
    handleCommand(msg);
}

module.exports = handler;
