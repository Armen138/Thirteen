var Sandbox = require("sandbox");
var fs = require("fs");
var http = require("http");
var url = require("url");

var load = function() {
    var messages = {};
    if(fs.existsSync("data/functions.json")) {
        messages = JSON.parse(fs.readFileSync("data/functions.json"));
        for(var name in messages) {
            var data = messages[name];
            func.commands[name] = buildCommand(data, 'Armen', name);
        }
    }
};

var save = function() {
    var messages = {};
    for(var command in func.commands) {
        messages[command] = func.commands[command].src;
    }
    fs.writeFileSync("data/functions.json", JSON.stringify(messages));
};

var help = "Available options for this command: 'define', 'delete', 'source'";
var about = {
    'define': '!function define <function name> <function body or gist url>',
    'delete': '!function delete <function name>',
    'source': '!function source <function name>'
};

var buildCommand = function(code, owner, name) {
    var command = function(msg) {
        var prefix = bootstrap(msg.message);
        var exec = prefix + code;
        var sandbox = new Sandbox({timeout: 5000});
        sandbox.options.timeout = 5000;
        sandbox.on('message', function(message) {
            var msg = JSON.parse(message);
            console.log(message);
            //console.log(sandbox);
            if(msg.action === 'write') {
                fileName = 'data/' + name + '-' + msg.name;
                fs.writeFileSync(fileName, msg.data + '');
                sandbox.postMessage(JSON.stringify({ action: 'save', data: 'success', id: msg.id }));
                return;
            }
            if(msg.action === 'read') {
                fileName = 'data/' + name + '-' + msg.name;
                if(fs.existsSync(fileName)) {
                    var data = fs.readFileSync(fileName) + '';
                    sandbox.postMessage(JSON.stringify({ action: 'read', data: data, id: msg.id }));
                } else {
                    sandbox.postMessage(JSON.stringify({ action: 'read', data: '', error: 'no such file: ' + fileName, id: msg.id }));
                }
                return;
            }
            sandbox.postMessage(JSON.stringify({ action: 'unknown', data: 'unknown function', id: msg.id}));
        });
        sandbox.run(exec, function(out) {
            console.log(out);
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
    command.owner = owner;
    command.src = code;
    return command;
};

var generateCommand = function(args, name, owner) {
    console.log(args);
    if(args[3].indexOf('http') !== -1) {
        var loc = url.parse(args[3]);
        var options = {
            hostname: loc.hostname,
            port: 80,
            path: loc.path,
            method: "GET"
        };
        console.log(options);
        var req = http.request(options, function(res) {
            res.setEncoding("utf8");
            var data = "";
            res.on("data", function(chunk) {
                data += chunk;
            });
            res.on("end", function() {
                console.log('building function: ' + data);
                func.commands[name] = buildCommand(data, owner, name);
                func.commandHandler.register(name, func.commands[name]);
                save();
            });
        });
        req.end();

    } else {
        args.shift();
        args.shift();
        args.shift();
        var code = args.join(' ');
        func.commands[name] = buildCommand(code, owner, name);
        func.commandHandler.register(name, func.commands[name]);
        save();
    }

};

var bootstrapCode = function() {
    var _callbacks = {};
    var _msgid = 0;
    var storage = {};
    var makeMessageReceiver = function() {
        return function(message) {
            var msg = JSON.parse(message);
            if(_callbacks[msg.id]) {
                _callbacks[msg.id](msg.data, msg.error);
            }
        };
    };
    storage.write = function(name, data, callback) {
        var msg = {};
        msg.action = "write";
        msg.name = name;
        msg.data = data;
        msg.id = _msgid++;
        if(callback) {
            onmessage = makeMessageReceiver();
            _callbacks[msg.id] = function(data) {
                callback(data);
                onmessage = null;
            };
        }
        postMessage(JSON.stringify(msg));
    };
    storage.read = function(name, callback) {
        var msg = { action: "read", name: name, id: _msgid++ };
        if(callback) {
            onmessage = makeMessageReceiver();
           _callbacks[msg.id] = function(data, error) {
               callback(data, error);
               onmessage = null;
           };
        }
        postMessage(JSON.stringify(msg));
    };
};
var bootstrap = function(msg) {
    var args = msg.split(' ');
    args.shift();
    var code = '$$ = "' + args.join(' ') + '";';
    for(var i = 0; i < args.length; i++) {
        code += '$' + (i + 1) + '="' + args[i] + '";';
    }
    code += bootstrapCode.toString().replace(/^[^{]*{\s*/,'').replace(/\s*}[^}]*$/,'');
    console.log(code);
    //code += 'var _callbacks = {}; onmessage = function(message) { console.log(message); var msg = JSON.parse(message); if(_callbacks[msg.id]) { _callbacks[msg.id](msg.data);; }};';
    //code += 'var _msgid = 0; var storage = {}; storage.write = function(name, data, callback) { var msg = {}; msg.action = "write"; msg.name = name; msg.data = data; msg.id = _msgid++; postMessage(JSON.stringify(msg)); if(callback) {_callbacks[msg.id] = callback; }};';
    //code += 'storage.read = function(name, callback) { var msg = { action: "read", name: name, id: _msgid++ }; postMessage(JSON.stringify(msg)); if(callback) {_callbacks[msg.id] = callback; }};';
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
                case 'delete':
                    if( func.commands[command] &&
                        func.commands[command].owner === msg.nick) {
                        func.bot.say(msg.channel, 'Deleting command...');
                        func.commandHandler.unregister(command);
                        delete func.commands[command];
                        save();
                    } else {
                        func.bot.say(msg.channel, 'You are not allowed to delete this command.');
                    }
                    break;
                case 'define':
                    console.log(msg);
                    if( func.commands[command] &&
                        func.commands[command].owner === msg.nick) {
                        func.bot.say(msg.channel, 'Redefining command...');
                    } else {
                        if(func.commandHandler.exists(command)) {
                            return "You are not allowed to redefine this command.";
                        }
                        func.bot.say(msg.channel, 'Defining command...');
                    }
                    generateCommand(args, command, msg.nick);
                    break;
                case 'source':
                    func.bot.say(msg.channel, func.commands[command].src);
                    break;
            }
        }
    }
};
load();
module.exports = func;
