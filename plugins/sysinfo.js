var moment = require("moment");
var start = Date.now();
var info = {
    name: "SysInfo",
    web: {
        "uptime": function(request, response) {
            response.end("started " + moment(start).fromNow());
        }
    },
    commands: {
        "uptime": function(msg) {
            info.bot.action(msg.channel, "started " + moment(start).fromNow());
        }
    }
};

module.exports = info;
