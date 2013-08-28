var bot = require("./bot");
var staticMessages = require("./plugins/staticMessages");
var seen = require("./plugins/seen");
var sysinfo = require("./plugins/sysinfo");
var jsrun = require("./plugins/jsrun");
var courtesy = require("./plugins/courtesy");

//bot.server = "192.168.47.146";
bot.connect({
    "channels": ["#13tanks"],
    "port": 6667,
    "showErrors": true,
    "debug": true,
    "userName": "13tanks",
    "realName": "13tanks"
});

bot.register(seen);
bot.register(sysinfo);
bot.register(staticMessages);
bot.register(courtesy);
bot.register(jsrun);
