var http = require("http");

var google = {
    commands: {
        "g": function(msg) {
            var message = msg.message.match(/(google|g)\s(.*)/);
            var query = (message && message.length == 3) ? message[2] : "google";

            var options = {
                hostname: "ajax.googleapis.com",
                port: 80,
                path: "/ajax/services/search/web?v=1.0&q=" + encodeURIComponent(query),
                method: "GET"
            };

            var req = http.request(options, function(res) {
                res.setEncoding("utf8");

                var data = "";

                res.on("data", function(chunk) {
                    data += chunk;
                });

                res.on("end", function() {
                    var result,
                        results = (JSON.parse(data)).responseData.results;

                    if (results && results[0]) {
                        var url = decodeURIComponent(results[0].url),
                            title = results[0].titleNoFormatting;

                        result = title + " ( " + url + " )";
                    }

                    if (!result) {
                        result = "no results found..";
                    }
                    google.bot.say(msg.channel, msg.nick + ": " + result);
                })
            });
            req.end();

        },
        "google": function(msg) {
            this.g(msg);
        }
    }

}

module.exports = google;
