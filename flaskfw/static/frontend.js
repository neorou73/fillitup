$( document ).ready(function() {
    console.log( "document frontend.js ready!" )
    const location = window.location
    console.log(location) // use pathname 
    
    if (location.pathname.substring(0, 8) == "/editor") {
        $.get("/static/fe_editor.html", function(data){
            $("#includedHtml").html(data);
        });
    } else if (location.pathname.substring(0, 5) == "/read") {
        $.get("/static/fe_read.html", function(data){
            $("#includedHtml").html(data);
        });
    } else if (location.pathname.substring(0, 7) == "/manage") {
        $.get("/static/fe_manage.html", function(data){
            $("#includedHtml").html(data);
        });
    } else if (location.pathname.substring(0, 6) == "/users") {
        $.get("/static/fe_users.html", function(data){
            $("#includedHtml").html(data);
        });
    } else if (location.pathname.substring(0, 1) == "/") {
        $.get("/static/fe_index.html", function(data){
            $("#includedHtml").html(data);
        });
    } else {
        $.get("/static/fe_404.html", function(data){
            $("#includedHtml").html(data);
        });
    }
})