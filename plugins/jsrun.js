var Sandbox = require("sandbox");
var sandbox = new Sandbox();
var run = {
    commands: {
        "run": function(msg) {
            var code = msg.message.substr(5);
            sandbox.run(code, function(out) {
                console.log(out);
                run.bot.say(msg.channel, out.result);
            });
        }
    }
};

module.exports = run;
