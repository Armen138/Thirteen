var bot = require("./bot");
var staticMessages = require("./plugins/staticMessages");
var seen = require("./plugins/seen");
var sysinfo = require("./plugins/sysinfo");
var jsrun = require("./plugins/jsrun");
var courtesy = require("./plugins/courtesy");
var RSS = require("./plugins/rss");

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
bot.register(RSS("armen138", "http://armen138.com/rss"));
bot.register(RSS("html5rocks", "http://feeds.feedburner.com/html5rocks?format=xml"));
bot.register(RSS("mozilla", "https://blog.mozilla.org/feed/"));

