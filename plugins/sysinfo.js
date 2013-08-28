var moment = require("moment");
var start = Date.now();
var info = {
    commands: {
        "uptime": function(msg) {
            info.bot.action(msg.channel, "started " + moment(start).fromNow());
        }
    }
};

module.exports = info;
