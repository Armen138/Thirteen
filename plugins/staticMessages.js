var messages = {
    "home": "http://13tanks.com",
    "mdn": "https://developer.mozilla.org/"
};

var handler = {
    "name": "Static Messages",
    "commands": {},
    "web": {
        "messages": function(request, respond) {
            respond.end(JSON.stringify(messages));
        }
    }
};

var handleCommand = function(msg) {
    handler.commands[msg] = function() {
        return messages[msg];
    };
};

for(var msg in messages) {
    handleCommand(msg);
}

module.exports = handler;
