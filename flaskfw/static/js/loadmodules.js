import {test, getUsers, getKeywords, getFileUploads, getHtmlContents, xhrGet, xhrPost, addUserPost, addKeywordPost, addHtmlContentPost, addFileUploadPost, updateHtmlContentPost } from './modules/apiCalls.js'
import {evaluateString, valuateVjsFors, buildObjectBindings, buildHtmlTable} from './modules/dataBindings.js'

console.log(test())

let vjsObjects = { "ifs": [], "fors": [], "models": [], "identifiers": [] }
if (location.pathname.substring(0, 9) == "/keywords") {
    getKeywords()
    let xhr = xhrGet("/static/views/keywords.html")
    xhr.onload = () => {
        document.title = "keywords"
        document.getElementById("includedHtml").innerHTML = xhr.response
        const allkeywords = JSON.parse(sessionStorage.getItem('allkeywords'))
        document.getElementById("allkeywordslist").innerHTML = buildHtmlTable(Object.keys(allkeywords[0]), allkeywords, false)
        document.getElementById('keyword.add').addEventListener('click', () => {
            const keywordData = {
                "name": document.getElementById('keyword.add.keyword').value,
                "description": document.getElementById('keyword.add.description').value
            }
            addKeywordPost(keywordData)
        })
        buildObjectBindings(vjsObjects)
    }
    xhr.send()
} else if (location.pathname.substring(0, 8) == "/uploads") {
    //getFileUploads()
    let xhr = xhrGet("/static/views/uploads.html")
    xhr.onload = () => {
        document.title = "File Uploads"
        document.getElementById("includedHtml").innerHTML = xhr.response;
        document.getElementById('fileuploads.upload').addEventListener('click', () => {})
        buildObjectBindings(vjsObjects)
    }
    xhr.send()
} else if (location.pathname.substring(0, 7) == "/editor") {
    if (location.pathname == "/editor") {
        window.location.replace(location.origin + "/read")
    } else {
        const queriedTitle = location.pathname.replace("/editor/","")
        let xhr = xhrGet("/static/views/editor.html")
        xhr.onload = () => {
            document.title = "Edit Content"
            document.getElementById("includedHtml").innerHTML = xhr.response
            let xhr2 = xhrGet(('/api/htmlcontents/get/' + queriedTitle))
            xhr2.onload = () => {
                console.log(xhr2)
                if (xhr2.readyState == 4 && xhr2.status == 200) {
                    let xhr2response = JSON.parse(xhr2.response) 
                    console.log(xhr2response)
                    if (xhr2response.hasOwnProperty('title') && xhr2response.hasOwnProperty('content')) {
                        document.getElementById('htmlcontent.content').innerText = xhr2response.content
                    }
                    document.getElementById('htmlcontent.title').innerText = queriedTitle
                    document.getElementById('htmlcontent.save').addEventListener('click', () => {
                        const htmlContentData = {
                            "title": queriedTitle,
                            "content": document.getElementById('htmlcontent.content').value
                        }
                        addHtmlContentPost(htmlContentData)
                    })
                    buildObjectBindings(vjsObjects)
                } else {
                    document.getElementById('htmlcontent.title').innerText = queriedTitle
                    document.getElementById('htmlcontent.save').addEventListener('click', () => {
                        const htmlContentData = {
                            "title": queriedTitle,
                            "content": document.getElementById('htmlcontent.content').value
                        }
                        updateHtmlContentPost(htmlContentData)
                    })
                    buildObjectBindings(vjsObjects)
                }
            }
            xhr2.onerror = (e) => {
                console.log(e)
            }
            xhr2.send()
        }
        xhr.send()
    }
    
} else if (location.pathname.substring(0, 5) == "/read") {
    getHtmlContents()
    if (location.pathname == "/read") {
        let xhr = xhrGet("/static/views/read.html")
        xhr.onload = () => {
            document.title = "Read Content"
            document.getElementById("includedHtml").innerHTML = xhr.response;
            const allhtmlcontents = JSON.parse(sessionStorage.getItem('allhtmlcontents'))
            console.log(allhtmlcontents)
            document.getElementById("allhtmlcontentslist").innerHTML = buildHtmlTable(Object.keys(allhtmlcontents[0]), allhtmlcontents, true)
            buildObjectBindings(vjsObjects)
            document.getElementById("content-exists-to-read").setAttribute("display", "none")
        }
        xhr.send()
    } else {
        const queriedTitle = location.pathname.replace("/read/","")
        let xhr = xhrGet("/static/views/read.html")
        xhr.onload = () => {
            document.title = "Read Content"
            document.getElementById("includedHtml").innerHTML = xhr.response;
            const allhtmlcontents = JSON.parse(sessionStorage.getItem('allhtmlcontents'))
            console.log(allhtmlcontents)
            document.getElementById("allhtmlcontentslist").innerHTML = buildHtmlTable(Object.keys(allhtmlcontents[0]), allhtmlcontents, true)
            let xhr2 = xhrGet(('/api/htmlcontents/get/' + queriedTitle))
            xhr2.onload = () => {
                if (xhr2.readyState == 4) {
                    let xhr2response = JSON.parse(xhr2.response) 
                    console.log(xhr2response)
                    if (xhr2response.hasOwnProperty('title') && xhr2response.hasOwnProperty('content')) {
                        document.getElementById('htmlcontent.content').innerText = xhr2response.content
                    }
                    document.getElementById('htmlcontent.title').innerText = queriedTitle
                    
                    buildObjectBindings(vjsObjects)
                }
            }
            xhr2.send()

            
            // buildObjectBindings(vjsObjects)
        }
        xhr.send()

        document.title = "Edit Content"
            document.getElementById("includedHtml").innerHTML = xhr.response
            
    }
} else if (location.pathname.substring(0, 7) == "/manage") {
    let xhr = xhrGet("/static/views/manage.html")
    xhr.onload = () => {
        document.title = "Manage System"
        document.getElementById("includedHtml").innerHTML = xhr.response;
        buildObjectBindings(vjsObjects)
    }
    xhr.send()
} else if (location.pathname.substring(0, 6) == "/users") {
    getUsers()
    let xhr = xhrGet("/static/views/users.html")
    xhr.onload = () => {
        document.title = "Manage Users"
        document.getElementById("includedHtml").innerHTML = xhr.response;
        const allusers = JSON.parse(sessionStorage.getItem('allusers'))
        document.getElementById("alluserslist").innerHTML = buildHtmlTable(Object.keys(allusers[0]), allusers, true)
        document.getElementById('user.create').addEventListener('click', () => {
            const userData = {
                "username": document.getElementById('user.create.username').value,
                "email": document.getElementById('user.create.email').value,
                "password": document.getElementById('user.create.password').value,
            }
            addUserPost(userData)
        })
        //document.getElementById('user.update').addEventListener('click', () => {})
        //document.getElementById('user.pwreset').addEventListener('click', () => {})
        //document.getElementById('user.toggleactive').addEventListener('click', () => {})
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
        const postData = {
            "email": document.getElementById("loginFormEmail").value,
            "password": document.getElementById("loginFormPassword").value
        }
        console.log(postData)
        let xhr = xhrPost('/login')


        //Send the proper header information along with the request
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = () => {
            if (xhr.readyState == 4) {
                console.log(xhr.response)
                setAccessScope(JSON.parse(xhr.response))
                isLoggedIn()
            }
        }
        console.log(postData)
        xhr.send(JSON.stringify(postData))
    }

    document.getElementById("logoutFormLogoutButton").onclick = (e) => {
        console.log("logging out")
        destroyAccessScope()
        isLoggedIn()
    }

    isLoggedIn()
});
