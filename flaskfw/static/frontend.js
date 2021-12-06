$( document ).ready(function() {
    console.log( "document frontend.js ready!" )
    const location = window.location
    console.log(location) // use pathname 
    /*
    @app.route("/")
    @app.route("/manage")
    @app.route("/manage/<path:text>")
    @app.route("/users")
    @app.route("/users/<path:text>")
    @app.route("/editor/<path:text>")
    @app.route("/read/<path:text>")
    */
    const clientRouterMap = {
        "/": {
            "view": "index.html", "javascripts": ["index.js"]
        },
        "/manage": {
            "view": "manage.html", "javascripts": ["manage.js"]
        },
        "/users": {
            "view": "users.html", "javascripts": ["users.js"]
        },
        "/editor": {
            "view": "editor.html", "javascripts": ["editor.js"]
        },
        "/read": {
            "view": "read.html", "javascripts": ["read.js"]
        }
    }
    
    if (location.pathname.substring(0, 8) == "/editor") {
        console.log(clientRouterMap["/editor"])
        $.get("/static/fe_editor.html", function(data){
            $("#includedHtml").html(data);
        });
    } else if (location.pathname.substring(0, 5) == "/read") {
        console.log(clientRouterMap["/read"])
        $.get("/static/fe_read.html", function(data){
            $("#includedHtml").html(data);
        });
    } else if (location.pathname.substring(0, 7) == "/manage") {
        console.log(clientRouterMap["/manage"])
        $.get("/static/fe_manage.html", function(data){
            $("#includedHtml").html(data);
        });
    } else if (location.pathname.substring(0, 6) == "/users") {
        console.log(clientRouterMap["/users"])
        $.get("/static/fe_users.html", function(data){
            $("#includedHtml").html(data);
        });
    } else if (location.pathname.substring(0, 1) == "/") {
        console.log(clientRouterMap["/"])
        $.get("/static/fe_index.html", function(data){
            $("#includedHtml").html(data);
        });
    } else {
        console.log('404 not found')
        $.get("/static/fe_404.html", function(data){
            $("#includedHtml").html(data);
        });
    }
})