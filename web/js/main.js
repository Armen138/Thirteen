$(function() {
    var plugins;
    $.get("/plugins", function(data) {
        plugins = JSON.parse(data);
    });
    $(".plugin").click(function(e) {
        var item = $(this).html();
        if(plugins[item]) {
            window.location = "/" + plugins[item][0];
        }
    });
});
