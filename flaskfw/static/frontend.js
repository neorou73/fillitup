$( document ).ready(function() {
    console.log( "document frontend.js ready!" )
    const location = window.location
    console.log(location) // use pathname 
    const loggedIn = localStorage.getItem('fiuscope_at')

    const setAccessScope = (userData) => {
        localStorage.setItem('fiuEmail', userData.email)
        localStorage.setItem('fiuAccessToken', userData.accesstoken)
        localStorage.setItem('fiuScope', { 'email': userData.email, 'accesstoken': userData.accesstoken })
    }

    const destroyAccessScope = () => {
        localStorage.removeItem('fiuEmail')
        localStorage.removeItem('fiuAccessToken')
        localStorage.removeItem('fiuScope')
        localStorage.clear()
    }

    const showLogin = (status) => {
        if (status) {
            $("#loginFormDiv").show()
            $("#logoutDiv").hide()
        } else {
            $("#loginFormDiv").hide()
            $("#logoutDiv").show()
        }
    }

    const isLoggedIn = () => {
        console.log(localStorage)
        if (localStorage.getItem('fiuEmail') != null || localStorage.getItem('fiuAccesToken') != null) {
            console.log('user is logged in, showing logout')
            showLogin(false)
        } else {
            console.log('showing login screen')
            showLogin(true)
        }
    }

    /* process login event and manage token */
    $("#loginFormLoginButton").click((e) => {
        console.log("login form clicked")
        const postData = {
            "email": $("#loginFormEmail").val(),
            "password": $("#loginFormPassword").val()
        }
        console.log(postData)
        e.preventDefault(); // avoid to execute the actual submit of the form.
        $.ajax({
            type: "POST",
            url: '/login',
            data: postData, // serializes the form's elements.
            success: function(response){
                console.log(response) // show response from the php script.
                const userData = { 'email': response.email, 'accesstoken': response.accesstoken }
                setAccessScope(userData)
                isLoggedIn()
            },
            error: function(eresponse){
                console.log(eresponse)
                destroyAccessScope()
                isLoggedIn()
            }
        })
    })

    $("#logoutFormLogoutButton").click((e) => {
        console.log("logging out")
        destroyAccessScope()
        isLoggedIn()
    })

    isLoggedIn()

    /* 
    if (localStorage.getItem('fiuscope_at') != null) {
        console.log('you are logged you in')
        console.log("access token value is " + localStorage.getItem('fiuscope_at'))
        console.log("scope count is " + localStorage.getItem('fiuscope_count'))
        showLogin(false)
    } else {
        console.log('logging you in')
        localStorage.setItem('fiuscope_count', 1)
        localStorage.setItem('fiuscope_at', 'asdf1234')
        showLogin(true)
    }

    const ct = parseInt(localStorage.getItem('fiuscope_count'))
    if (ct >= 3) {
        console.log('logging you out')
        localStorage.removeItem('fiuscope_at')
        localStorage.removeItem('fiuscope_count')
        localStorage.clear()
        showLogin(false)
    } else {
        localStorage.setItem('fiuscope_count', (ct + 1))
        showLogin(true)
    }
    */

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