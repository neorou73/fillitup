import {test, getUsers, getKeywords, getFileUploads, getHtmlContents, xhrGet, xhrPost, addUserPost } from './modules/apiCalls.js'
import {evaluateString, valuateVjsFors, buildObjectBindings, buildHtmlTable} from './modules/dataBindings.js'

console.log(test())
getUsers()
//getKeywords()
//getFileUploads()
//getHtmlContents()

let vjsObjects = { "ifs": [], "fors": [], "models": [], "identifiers": [] }
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
        document.getElementById("alluserslist").innerHTML = buildHtmlTable(Object.keys(allusers[0]), allusers)
        document.getElementById('user.create').addEventListener('click', () => {
            //const userDataString = "username=" + document.getElementById('user.create.username').value + "&password=" + document.getElementById('user.create.password').value + "&email=" + document.getElementById('user.create.email').value 
            //console.log('create user ' + userDataString)
            const userData = {
                "username": document.getElementById('user.create.username').value,
                "email": document.getElementById('user.create.email').value,
                "password": document.getElementById('user.create.password').value,
            }
            addUserPost(userData)
        })
        document.getElementById('user.update').addEventListener('click', () => {})
        document.getElementById('user.pwreset').addEventListener('click', () => {})
        document.getElementById('user.toggleactive').addEventListener('click', () => {})
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

    let appDomBindings = {
        'htmlContents': {},
        'keywords': {},
        'isLoggedIn': {
            'state': false
        }
    }
    
    /* 
    'isLoggedIn': {
            'state': True,
            'objects': {
                'users': {},
                'fileUploads': {},
                'me': {}
            }
        }
    'isLoggedIn': {
            'state': False
        }
    */
    
    const setAccessScope = (userData) => {
        localStorage.setItem('fiuRootScope', JSON.stringify({ 
            'me.email': userData.email, 
            'me.accesstoken': userData.accesstoken }))
        appDomBindings['isLoggedIn']['state'] = true 
        appDomBindings['isLoggedIn']['objects'] = {
            'users': {},
            'fileUploads': {},
            'me': {}
        }
        localStorage.setItem('domBindings', appDomBindings)
        console.log(appDomBindings)
    }

    const destroyAccessScope = () => {
        localStorage.removeItem('fiuRootScope')
        localStorage.clear()
        appDomBindings['isLoggedIn']['state'] = false 
        delete appDomBindings['isLoggedIn']['objects']
        localStorage.setItem('domBindings', appDomBindings)
        console.log(appDomBindings)
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
        //console.log(localStorage)
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
