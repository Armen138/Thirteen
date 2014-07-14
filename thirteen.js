var fs = require('fs');
var bot = require("./bot");
var PluginLoader = require("./pluginLoader");
var RSS = require("./plugins/rss");
//default config
var config = {
    "nickname": "Thirteen[test]",
    "channels": ["#13test"],
    "port": 6667,
    "showErrors": true,
    "debug": true,
    "userName": "13tanks",
    "realName": "13tanks"
};

fs.readFile(__dirname + '/data/config.json', function(err, data) {
    if(err) {
        console.log('No configuration loaded, using defaults');
        main();
        return;
    }

    var configData = JSON.parse(data);
    for(var item in configData) {
        config[item] = configData[item];
    }
    main();
});

var main = function() {
    bot.name = config.nickname;
    bot.connect(config);
    var pluginLoader = PluginLoader(bot);
    bot.register(RSS("armen138", "http://armen138.com/rss"));
    bot.register(RSS("html5rocks", "http://feeds.feedburner.com/html5rocks?format=xml"));
    bot.register(RSS("mozilla", "https://blog.mozilla.org/feed/"));
};
