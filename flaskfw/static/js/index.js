if(document.readyState === "complete") {
    // Fully loaded!
    console.log( "document index.js ready!" )
    
    
}
else if(document.readyState === "interactive") {
    // DOM ready! Images, frames, and other subresources are still downloading.
    console.log('DOM ready! Images, frames, and other subresources are still downloading.')
}
else {
    // Loading still in progress.
    // To wait for it to complete, add "DOMContentLoaded" or "load" listeners.

    window.addEventListener("DOMContentLoaded", () => {
        // DOM ready! Images, frames, and other subresources are still downloading.
        console.log("DOM ready! Images, frames, and other subresources are still downloading.")
    });

    window.addEventListener("load", () => {
        // Fully loaded!
        console.log("Fully loaded!")
        const location = window.location
        console.log(location) // use pathname 

        const setAccessScope = (userData) => {
            localStorage.setItem('fiuRootScope', JSON.stringify({ 
                'me.email': userData.email, 
                'me.accesstoken': userData.accesstoken }))
        }

        const destroyAccessScope = () => {
            localStorage.removeItem('fiuRootScope')
            localStorage.clear()
        }

        const showLogin = (status) => {
            if (status) {
                document.getElementById("loginFormDiv").style.display = 'inline'
                document.getElementById("logoutDiv").style.display = 'none'
            } else {
                document.getElementById("loginFormDiv").style.display = 'none'
                document.getElementById("logoutDiv").style.display = 'inline'
            }
        }

        const isLoggedIn = () => {
            console.log(localStorage)
            if (localStorage.getItem('fiuRootScope') != null ) {
                console.log('user is logged in, showing logout')
                showLogin(false)
            } else {
                console.log('showing login screen')
                showLogin(true)
            }
        }

        const xhrPost = (postUrl) => {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", postUrl, true);

            //Send the proper header information along with the request
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8"); // "application/json;charset=UTF-8"
            return xhr
            //xhr.onreadystatechange = () => { // Call a function when the state changes.
                //if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                    // Request finished. Do processing here.
                    //console.log(xhr.response)
                //}
            //}
            // xhr.send("foo=bar&lorem=ipsum"); // data as url safe text
            // xhr.send(new Int8Array());
            // xhr.send(document);
            // to send data instead of application/x-www-form-urlencoded, use application/json instead
        }

        /* process login event and manage token */
        document.getElementById("loginFormLoginButton").onclick = (e) => {
            console.log("login form clicked")
            const postData = {
                "email": document.getElementById("loginFormEmail").value,
                "password": document.getElementById("loginFormPassword").value
            }
            console.log(postData)
            e.preventDefault(); // avoid to execute the actual submit of the form.
            let xhr = xhrPost("/login")
            xhr.onreadystatechange = () => { // Call a function when the state changes.
                if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                    // Request finished. Do processing here.
                    console.log(xhr.response)
                    const userData = { 'email': xhr.response.email, 'accesstoken': xhr.response.accesstoken }
                    setAccessScope(userData)
                    isLoggedIn()
                } else {
                    console.log(xhr.response)
                    destroyAccessScope()
                    isLoggedIn()
                }
            }
            xhr.send(JSON.parse(postData)); // data as url safe text
        }

        document.getElementById("logoutFormLogoutButton").click((e) => {
            console.log("logging out")
            destroyAccessScope()
            isLoggedIn()
        })

        isLoggedIn()

        let xhrGet = (urlString) => {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', urlString, true);
            return xhr
        }

        if (location.pathname.substring(0, 8) == "/editor") {
            let xhr = xhrGet("/static/views/editor.html")
            xhr.onload = () => {
                document.getElementById("includedHtml").innerHTML = xhr.response;
            }
            xhr.send()
        } else if (location.pathname.substring(0, 5) == "/read") {
            let xhr = xhrGet("/static/views/read.html")
            xhr.onload = () => {
                document.getElementById("includedHtml").innerHTML = xhr.response;
            }
            xhr.send()
        } else if (location.pathname.substring(0, 7) == "/manage") {
            let xhr = xhrGet("/static/views/manage.html")
            xhr.onload = () => {
                document.getElementById("includedHtml").innerHTML = xhr.response;
            }
            xhr.send()
        } else if (location.pathname.substring(0, 6) == "/users") {
            let xhr = xhrGet("/static/views/users.html")
            xhr.onload = () => {
                document.getElementById("includedHtml").innerHTML = xhr.response;
            }
            xhr.send()
        } else if (location.pathname.substring(0, 1) == "/") {
            let xhr = xhrGet("/static/views/index.html")
            xhr.onload = () => {
                document.getElementById("includedHtml").innerHTML = xhr.response;
            }
            xhr.send()
        } else {
            let xhr = xhrGet("/static/views/404.html")
            xhr.onload = () => {
                document.getElementById("includedHtml").innerHTML = xhr.response;
            }
            xhr.send()
        }
    });
}