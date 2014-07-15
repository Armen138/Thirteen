var Sandbox = require("sandbox");
var http = require("http");
var url = require("url");
var sandbox = new Sandbox();

var help = "Available options for this command: 'define', 'delete', 'source'";
var about = {
    'define': '!function define <function name> <function body or gist url>',
    'delete': '!function delete <function name>',
    'source': '!function source <function name>'
};

var generateCommand = function(args, name) {
    var buildCommand = function(code) {
        var command = function(msg) {
            var prefix = bootstrap(msg.message);
            var exec = prefix + code;
            sandbox.run(exec, function(out) {
                var log = out.result;
                if(log.length > 80) {
                    log = log.substr(0, 80);
                    log += "[...]";
                }
                var cons = "" + out.console.join("\n");
                if(cons.length > 80) {
                    cons = cons.substr(0, 80);
                    cons += "[...]";
                }
                if(log && log !== "null") {
                    func.bot.say(msg.channel, log);
                }
                if(out.console.length > 0) {
                    func.bot.say(msg.channel, cons);
                }
            });
        };
        command.src = code;
        return command;
    };
    if(args[3].indexOf('http') !== -1) {
        var loc = url.parse(args[3]);
        var options = {
            hostname: loc.hostname,
            port: 80,
            path: loc.path,
            method: "GET"
        };
        var req = http.request(options, function(res) {
            res.setEncoding("utf8");
            var data = "";
            res.on("data", function(chunk) {
                data += chunk;
            });
            res.on("end", function() {
                //var result,
                    //results = (JSON.parse(data)).responseData.results;
                func.commands[name] = buildCommand(data);
                func.commandHandler.register(name, func.commands[name]);
                //google.bot.say(msg. /channel, msg.nick + ": " + result);
            });
        });
        req.end();

    } else {
        args.shift();
        args.shift();
        args.shift();
        var code = args.join(' ');
        func.commands[name] = buildCommand(code);
        func.commandHandler.register(name, func.commands[name]);
    }

};
var bootstrap = function(msg) {
    var args = msg.split(' ');
    args.shift();
    var code = '';
    for(var i = 0; i < args.length; i++) {
        code += '$' + (i + 1) + '="' + args[i] + '";';
    }
    return code;
};

var func = {
    commands: {
        "function": function(msg) {
            var args = msg.message.split(' ');
            var command = args[2];
            switch(args[1]) {
                case 'help':
                    if(args.length === 2 || !about[args[2]]) {
                        func.bot.say(msg.channel, help);
                    } else {
                        func.bot.say(msg.channel, about[args[2]]);
                    }
                    break;
                case 'define':
                    if(func.commandHandler.exists(command)) {
                        return "You are not allowed to redefine this command.";
                    }
                    //func.commands[command] =
                    generateCommand(args, command);
                    func.bot.say(msg.channel, 'Defining command...');
                    break;
                case 'source':
                    func.bot.say(msg.channel, func.commands[command].src);
                    break;
            }
        }
    }
};

module.exports = func;
