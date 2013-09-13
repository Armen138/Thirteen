var fs = require("fs");
var plugins = {};
var loaded = {};
var save = function() {
    fs.writeFileSync("data/plugins.json", JSON.stringify(plugins));
};

if(fs.existsSync("data/seen.json")) {
     plugins = JSON.parse(fs.readFileSync("data/plugins.json"));
}

for(var i = 0; i < plugins.loaded.length; i++) {
    loaded[plugins.loaded[i]] = require("./plugins/" + plugins.loaded[i]);
}

var Loader = function(bot) {
    for(var p in loaded) {
        bot.register(loaded[p]);
    }
    var loader = {
        load: function(name) {
            if(!loaded[name]) {
                loaded[name] = require("./plugins/" + name);                plugins.loaded.push(name);
                save();
            } else {
                bot.register(loaded[name]);
            }
        }
    };
};

module.exports = Loader;
