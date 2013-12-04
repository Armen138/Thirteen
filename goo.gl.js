var http = require("https");
var options = function(data) {
    var opt = {
        hostname: "www.googleapis.com",
        port: 443,
        path: "/urlshortener/v1/url",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Content-Length": data.length
        }
    };
    return opt;
};

var goo = function(url, callback) {
    var data = JSON.stringify({ longUrl: url });
    var opt = options(data);
    console.log(opt);
    var req = http.request(opt, function(res) {
        console.log(res.statusCode);
        res.setEncoding("utf8");

        var data = "";

        res.on("data", function(chunk) {
            data += chunk;
        });

        res.on("end", function() {
            var url = JSON.parse(data);
            callback(url.id);
        });
    });
    req.write(data);
    req.end();
};

module.exports = goo;
