var http = require('http');
var fs = require('fs');

var locations = {};
if(fs.existsSync('data/weather.json')) {
    locations = JSON.parse(fs.readFileSync('data/weather.json'));
}

var save = function() {
    fs.writeFileSync('data/weather.json', JSON.stringify(locations));
};

var Weather = function(city) {
    var api = {
        hostname: 'api.openweathermap.org',
        port: 80,
        path: '/data/2.5/weather?q=' + city,
        method: 'GET'
    };
    var weather = {
        get: function(callback) {
            var request = http.request(api, function(res) {
                var data = '';
                res.setEncoding('utf8');
                res.on('data', function(chunk) {
                    data += chunk;
                });
                res.on('end', function() {
                    var current = JSON.parse(data);
                    callback(current);
                });
            });
            request.on('error', function(e) {
                console.log('Error getting weather for ' + city + ', ' + e.message);
            });
            request.end();
        },
        format: function(conditions) {
            var celcius = (conditions.main.temp - 273.15).toFixed(1);
            var fahrenheit = (celcius * 1.8 + 32).toFixed(1);
            var formatted = 'Weather for ' + conditions.name + '(' + conditions.sys.country + '), ';
            formatted += celcius + '°C(' + fahrenheit + '°F), ';
            formatted += conditions.weather[0].description;
            return formatted;
        }
    };
    return weather;
};

//var weather = new Weather("Montreal");
//weather.get(function(current) {
    //console.log(current);
    //console.log(weather.format(current));
//});
//
var weather = {
    name: "Weather Plugin",
    commands: {
        "weather": function(msg) {
            var text = msg.message;
            var args = text.split(" ");
            args.shift();
            var city = "";
            if(args.length > 0) {
                city = args.join(' ');
            } else {
                if(locations[msg.nick]) {
                    city = locations[msg.nick];
                } else {
                    return "I don't know where you are, please specify";
                }
            }
            locations[msg.nick] = city;
            save();
            var current = new Weather(city);
            current.get(function(w) {
                if(w.message) {
                    weather.bot.say(msg.channel, w.message);
                } else {
                    weather.bot.say(msg.channel, current.format(w));
                }
            });
        }
    }
};

module.exports = weather;
