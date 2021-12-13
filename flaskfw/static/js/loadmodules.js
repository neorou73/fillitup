import {test, getUsers, getKeywords, getFileUploads, getHtmlContents, xhrGet, xhrPost } from './modules/apiCalls.js'

console.log(test())
getUsers()
//getKeywords()
//getFileUploads()
//getHtmlContents()

let vjsObjects = { "ifs": [], "fors": [], "models": [] }
const buildObjectBindings = (vjsObjects) => {
    const vjsIfs = document.querySelectorAll("[vjs-if]")
    vjsIfs.forEach((ele) => {
        const ifsData = { "classes": ele.classList, "id": ele.id, "vjsIf": ele.getAttribute("vjs-if"), "data": ele.innerHTML }
        vjsObjects["ifs"].push(ifsData)
    })
    const vjsFors = document.querySelectorAll("[vjs-for]")
    vjsFors.forEach((ele) => {
        const forsData = { "classes": ele.classList, "id": ele.id, "vjsFor": ele.getAttribute("vjs-for"), "data": ele.innerHTML }
        vjsObjects["fors"].push(forsData)      
    })
    const vjsModels = document.querySelectorAll("[vjs-model]")
    vjsModels.forEach((ele) => {
        const modelsData = { "classes": ele.classList, "id": ele.id, "vjsModel": ele.getAttribute("vjs-model"), "data": ele.innerHTML }
        vjsObjects["models"].push(modelsData)      
    })
    console.log(vjsObjects)
}

if (location.pathname.substring(0, 9) == "/keywords") {
    let xhr = xhrGet("/static/views/keywords.html")
    xhr.onload = () => {
        document.title = "keywords"
        document.getElementById("includedHtml").innerHTML = xhr.response;
        buildObjectBindings(vjsObjects)
    }
    xhr.send()
} else if (location.pathname.substring(0, 8) == "/uploads") {
    let xhr = xhrGet("/static/views/uploads.html")
    xhr.onload = () => {
        document.title = "File Uploads"
        document.getElementById("includedHtml").innerHTML = xhr.response;
        buildObjectBindings(vjsObjects)
    }
    xhr.send()
} else if (location.pathname.substring(0, 8) == "/editor") {
    let xhr = xhrGet("/static/views/editor.html")
    xhr.onload = () => {
        document.title = "Edit Content"
        document.getElementById("includedHtml").innerHTML = xhr.response;
        buildObjectBindings(vjsObjects)
    }
    xhr.send()
} else if (location.pathname.substring(0, 5) == "/read") {
    let xhr = xhrGet("/static/views/read.html")
    xhr.onload = () => {
        document.title = "Read Content"
        document.getElementById("includedHtml").innerHTML = xhr.response;
        buildObjectBindings(vjsObjects)
    }
    xhr.send()
} else if (location.pathname.substring(0, 7) == "/manage") {
    let xhr = xhrGet("/static/views/manage.html")
    xhr.onload = () => {
        document.title = "Manage System"
        document.getElementById("includedHtml").innerHTML = xhr.response;
        buildObjectBindings(vjsObjects)
    }
    xhr.send()
} else if (location.pathname.substring(0, 6) == "/users") {
    let xhr = xhrGet("/static/views/users.html")
    xhr.onload = () => {
        document.title = "Manage Users"
        document.getElementById("includedHtml").innerHTML = xhr.response;
        const allusers = JSON.parse(sessionStorage.getItem('allusers'))
        document.getElementById("ajaxuserslist").innerHTML = allusers
        buildObjectBindings(vjsObjects)
    }
    xhr.send()
} else if (location.pathname.substring(0, 3) == "/me") {
    let xhr = xhrGet("/static/views/me.html")
    xhr.onload = () => {
        document.title = "About Me"
        document.getElementById("includedHtml").innerHTML = xhr.response;
        buildObjectBindings(vjsObjects)
    }
    xhr.send()
} else if (location.pathname.substring(0, 1) == "/") {
    let xhr = xhrGet("/static/views/index.html")
    xhr.onload = () => {
        document.title = "Welcome"
        document.getElementById("includedHtml").innerHTML = xhr.response;
        buildObjectBindings(vjsObjects)
    }
    xhr.send()
} else {
    let xhr = xhrGet("/static/views/404.html")
    xhr.onload = () => {
        document.title = "Error: Resource Not Found"
        document.getElementById("includedHtml").innerHTML = xhr.response;
    }
    xhr.send()
}

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

    /* process login event and manage token */
    document.getElementById("loginFormLoginButton").onclick = (e) => {
        console.log("login form clicked")
        let formData = 'email=' + encodeURIComponent(document.getElementById("loginFormEmail").value)
        formData = formData + '&password=' + encodeURIComponent(document.getElementById("loginFormPassword").value)
        console.log(formData)
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