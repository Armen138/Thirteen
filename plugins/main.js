var http = require('http');

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
            var formatted = 'Weather for ' + conditions.name + ', ';
            formatted += celcius + '&degC(' + fahrenheit + '&degF), ';
            formatted += conditions.weather[0].description;
            return formatted;
        }
    };
    return weather;
};

var weather = new Weather("Montreal");
weather.get(function(current) {
    console.log(current);
    console.log(weather.format(current));
});
//Weather.getCurrent("Montreal", function(current) {
    //console.log(current);
//});
