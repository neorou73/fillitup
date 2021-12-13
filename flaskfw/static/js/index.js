if(document.readyState === "complete") {
    // Fully loaded!
    console.log( "document index.js ready!" )
}
else if(document.readyState === "interactive") {
    // DOM ready! Images, frames, and other subresources are still downloading.
    console.log('DOM ready! Images, frames, and other subresources are still downloading at interactive state.')
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
        
        const xhrPost = (postUrl) => {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", postUrl, true);

            //Send the proper header information along with the request
            // xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8"); // "application/json;charset=UTF-8"
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // 
            return xhr
        }

        let xhrGet = (urlString) => {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', urlString, true);
            return xhr
        }

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

        /* process login event and manage token */
        document.getElementById("loginFormLoginButton").onclick = (e) => {
            console.log("login form clicked")
            let formData = 'email=' + encodeURIComponent(document.getElementById("loginFormEmail").value)
            formData = formData + '&password=' + encodeURIComponent(document.getElementById("loginFormPassword").value)
            console.log(formData)
            //e.preventDefault(); // avoid to execute the actual submit of the form.
            //var xhr = new XMLHttpRequest();
            //xhr.open("POST", "/login", true);
            //xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            let xhr = xhrPost('/login')
            xhr.onreadystatechange = () => { // Call a function when the state changes.
                // console.log(xhr.readyState) // use for tests only
                if (xhr.readyState == 4) {
                    // Request finished. Do processing here.
                    console.log(JSON.parse(xhr.response))
                    setAccessScope(JSON.parse(xhr.response))
                    isLoggedIn()
                }
            }
            xhr.send(formData); // data as url safe text
        }

        document.getElementById("logoutFormLogoutButton").onclick = (e) => {
            console.log("logging out")
            destroyAccessScope()
            isLoggedIn()
        }

        isLoggedIn()
        
    });
}