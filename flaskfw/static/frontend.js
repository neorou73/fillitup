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
        "/editors": {
            "view": "editors.html", "javascripts": ["editors.js"]
        },
        "/read": {
            "view": "read.html", "javascripts": ["read.js"]
        }
    }
    
    if (location.pathname.substring(0, 8) == "/editors") {
        console.log(clientRouterMap["/editors"])
    } else if (location.pathname.substring(0, 5) == "/read") {
        console.log(clientRouterMap["/read"])
    } else if (location.pathname.substring(0, 7) == "/manage") {
        console.log(clientRouterMap["/manage"])
    } else if (location.pathname.substring(0, 6) == "/users") {
        console.log(clientRouterMap["/users"])
    } else if (location.pathname.substring(0, 1) == "/") {
        console.log(clientRouterMap["/"])
    } else {
        console.log('404 not found')
    }
})