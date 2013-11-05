var Sandbox = require("sandbox");
var sandbox = new Sandbox();
var run = {
    commands: {
        "run": function(msg) {
            var code = msg.message.substr(5);
            sandbox.run(code, function(out) {
                var log = out.result;
                if(log.length > 80) {
                    log = log.substr(0, 80);
                    log += "[...]";
                }
                var cons = "console: " + out.console.join("\n");
                if(cons.length > 80) {
                    cons = cons.substr(0, 80);
                    cons += "[...]";
                }
                run.bot.say(msg.channel, log);
                if(out.console.length > 0) {
                    run.bot.say(msg.channel, cons);
                }
            });
        }
    }
};

module.exports = run;
