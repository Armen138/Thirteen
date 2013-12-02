var http = require("http");
//http://crum.bs/api.php?function=simpleshorten&url=
var options = function(url) {
    var opt = {
        hostname: "crum.bs",
        port: 80,
        path: "/api.php?function=simpleshorten&url=" + encodeURIComponent(url),
        method: "GET"
    };
    return opt;
};

var crumbs = function(url, callback) {
    var opt = options(url);
    console.log(opt);
    var req = http.request(opt, function(res) {
        console.log(res.statusCode);
        res.setEncoding("utf8");

        var data = "";

        res.on("data", function(chunk) {
            data += chunk;
        });

        res.on("end", function() {
            callback(data);
        });
    });
};

module.exports = crumbs;
