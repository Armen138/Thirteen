var messages = {
    "armen": "<3",
    "home": "http://13tanks.com",
    "chapter1": "http://13tanks.com/chapter1",
    "mdn": "https://developer.mozilla.org/"
};

var handler = {
    "commands": {}
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
