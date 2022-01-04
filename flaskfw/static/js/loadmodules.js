import {test, getUsers, getKeywords, getFileUploads, getHtmlContents, xhrGet, xhrPost, addUserPost, addKeywordPost, addHtmlContentPost, addFileUploadPost, updateHtmlContentPost } from './modules/apiCalls.js'
import {evaluateString, valuateVjsFors, translateMdInput, buildObjectBindings, buildHtmlTable} from './modules/dataBindings.js'

console.log(test())

let vjsObjects = { "ifs": [], "fors": [], "models": [], "identifiers": [] }

let appDomBindings = {
    'htmlContents': {},
    'keywords': {},
    'isLoggedIn': {
        'state': false
    }
}

const destroyAccessScope = () => {
    localStorage.removeItem('fiuRootScope')
    localStorage.removeItem('accesstoken')
    localStorage.removeItem('domBindings')
    localStorage.removeItem('email')
    localStorage.removeItem('isLoggedIn')
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
    const status = localStorage.getItem('isLoggedIn')
    console.log(status)
    if (status == null) {
        return false
    } else {
        return true
    }
}
isLoggedIn()

const checkLogout = () => {
    console.log("logging out")
    destroyAccessScope()
    let xhr = xhrGet("/logout")
    xhr.onload = () => {
        console.log(xhr.response)
        window.location.href = '/auth'
    }
    xhr.send()
    
}


if (location.pathname.substring(0, 9) == "/keywords" && isLoggedIn()) {
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
        document.getElementById("logoutFormLogoutButton").onclick = (e) => { checkLogout() }
    }
    xhr.send()
    document.getElementById("logoutFormLogoutButton").onclick = (e) => {
        console.log("logging out")
        destroyAccessScope()
        let xhr = xhrGet("/logout")
        xhr.onload = () => {
            console.log(xhr.response)
            window.location.href = '/auth'
        }
        xhr.send()
    }
} else if (location.pathname.substring(0, 8) == "/uploads" && isLoggedIn()) {
    getFileUploads()
    let xhr = xhrGet("/static/views/uploads.html")
    xhr.onload = () => {
        document.title = "File Uploads"
        document.getElementById("includedHtml").innerHTML = xhr.response
        const allfileuploads = JSON.parse(sessionStorage.getItem('allfileuploads'))
        console.log(allfileuploads)
        if (allfileuploads.length > 0) {
            document.getElementById("uploadedfileslist").innerHTML = buildHtmlTable(Object.keys(allfileuploads[0]), allfileuploads, false)
        }
        document.getElementById('fileuploads.upload').addEventListener('click', (event) => {
            event.preventDefault() // prevents the actual form button click to submit to the URL below
            const formid = document.getElementById('uploadedfileform')
            let xhr2 = new XMLHttpRequest();
            // Add any event handlers here...
            let fileInputElement = document.getElementById("userfile")
            let upFile = fileInputElement.files[0]
            console.log(upFile)
            let formData = new FormData();
            formData.append("file", upFile)
            formData.append("filetype", upFile.type)
            xhr2.open('POST', '/api/fileuploads/create', true);
            xhr2.send(formData)
            getFileUploads()
        })
        buildObjectBindings(vjsObjects)
        document.getElementById("logoutFormLogoutButton").onclick = (e) => { checkLogout() }
    }
    xhr.send()
} else if (location.pathname.substring(0, 7) == "/editor" && isLoggedIn()) {
    if (location.pathname == "/editor") {
        window.location.replace(location.origin + "/read")
    } else {
        getKeywords()
        const queriedTitle = location.pathname.replace("/editor/","")
        const allkeywords = JSON.parse(sessionStorage.getItem('allkeywords'))
        console.log(allkeywords)
        let keywordSpans = ""
        for (let k=0;k<allkeywords.length;k++) {
            keywordSpans = keywordSpans + "<span class='keywordClick'>| " + allkeywords[k]['name'] + " |</span>"
        }
        let xhr = xhrGet("/static/views/editor.html")
        xhr.onload = () => {
            document.title = "Edit Content"
            document.getElementById("includedHtml").innerHTML = xhr.response
            let xhr2 = xhrGet(('/api/htmlcontents/get/' + queriedTitle))

            document.getElementById('keywordSpans').innerHTML = keywordSpans
            xhr2.onload = () => {
                console.log(xhr2)
                if (xhr2.readyState == 4 && xhr2.status == 200) {
                    let xhr2response = JSON.parse(xhr2.response) 
                    console.log(xhr2response)
                    if (xhr2response.hasOwnProperty('title') && xhr2response.hasOwnProperty('markdownst')) {
                        document.getElementById('htmlcontent.markdownst').value = xhr2response.markdownst
                        document.getElementById('htmlcontent.keywords').value = xhr2response.meta.keywords.join('; ')
                    }
                    document.getElementById('htmlcontent.title').innerText = queriedTitle
                    document.getElementById('htmlcontent.link').innerHTML = "<a href='/read/" + queriedTitle + "'>read</a>"
                    document.getElementById('htmlcontent.save').addEventListener('click', () => {
                        let keywordsInput = document.getElementById('htmlcontent.keywords').value 
                        console.log(keywordsInput)
                        console.log(keywordsInput.split("; "))
                        const mdData = translateMdInput(document.getElementById('htmlcontent.markdownst').value)
                        const htmlContentData = {
                            "title": queriedTitle,
                            "markdownst": document.getElementById('htmlcontent.markdownst').value,
                            "content": mdData,
                            "meta": { 
                                "keywords": keywordsInput.split(";")
                            }
                        }
                        updateHtmlContentPost(htmlContentData)
                    })
                    buildObjectBindings(vjsObjects)
                    document.getElementById("logoutFormLogoutButton").onclick = (e) => { checkLogout() }
                } else {
                    document.getElementById('htmlcontent.title').innerText = queriedTitle
                    document.getElementById('htmlcontent.link').innerHTML = "<a href='/read/" + queriedTitle + "'>read</a>"
                    document.getElementById('htmlcontent.keywords').value = "general; test"
                    document.getElementById('htmlcontent.save').addEventListener('click', () => {
                        console.log(keywordsInput)
                        console.log(keywordsInput.split("; "))
                        const mdData = translateMdInput(document.getElementById('htmlcontent.markdownst').value)
                        const htmlContentData = {
                            "title": queriedTitle,
                            "markdownst": document.getElementById('htmlcontent.markdownst').value,
                            "content": mdData,
                            "meta": { 
                                "keywords": keywordsInput.split(";")
                            }
                        }
                        addHtmlContentPost(htmlContentData)
                        document.getElementById('htmlcontent.link').innerHTML = "<a href='/read/" + queriedTitle + "'>read</a>"
                    })
                    buildObjectBindings(vjsObjects)
                    document.getElementById("logoutFormLogoutButton").onclick = (e) => { checkLogout() }
                }
            }
            xhr2.onerror = (e) => {
                console.log(e)
            }
            xhr2.send()
        }
        xhr.send()
    }
    
} else if (location.pathname.substring(0, 5) == "/read" && isLoggedIn()) {
    console.log(localStorage)
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
            console.log(hljs)
            hljs.highlightAll()
            document.getElementById("logoutFormLogoutButton").addEventListener('click', (e) => { checkLogout() })
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
                        document.getElementById('htmlcontent.content').innerHTML = xhr2response.content
                    }
                    document.getElementById('htmlcontent.title').innerText = queriedTitle                    
                    buildObjectBindings(vjsObjects)
                    console.log(hljs)
                    hljs.highlightAll()
                    document.getElementById("logoutFormLogoutButton").addEventListener('click', (e) => { checkLogout() })
                }
            }
            xhr2.send()            
            // buildObjectBindings(vjsObjects)
        }
        xhr.send()
        document.title = "Edit Content"
        document.getElementById("includedHtml").innerHTML = xhr.response
            
    }
} else if (location.pathname.substring(0, 7) == "/manage" && isLoggedIn()) {
    let xhr = xhrGet("/static/views/manage.html")
    xhr.onload = () => {
        document.title = "Manage System"
        document.getElementById("includedHtml").innerHTML = xhr.response;
        buildObjectBindings(vjsObjects)
        document.getElementById("logoutFormLogoutButton").addEventListener('click', (e) => { checkLogout() })
    }
    xhr.send()
    
} else if (location.pathname.substring(0, 6) == "/users" && isLoggedIn()) {
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
        document.getElementById("logoutFormLogoutButton").addEventListener('click', (e) => { checkLogout() })
    }
    xhr.send()
    
} else if (location.pathname.substring(0, 5) == "/auth") {
    console.log('you are screwed')
    let xhr = xhrGet("/static/views/auth.html")    
    xhr.onload = () => {
        document.title = "Login"
        document.getElementById("includedHtml").innerHTML = xhr.response;
        document.getElementById('loginFormLoginButton').addEventListener('click', () => {
            console.log('trying to log in')
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
                    const xhrresponse = JSON.parse(xhr.response)
                    console.log(xhrresponse)
                    console.log(xhrresponse.accesstoken)
                    localStorage.setItem("email", xhrresponse.email)
                    localStorage.setItem("accesstoken", xhrresponse.accesstoken)
                    localStorage.setItem("isLoggedIn", true)
                    const fiuRootScope = { 
                        'me.email': xhrresponse.email, 
                        'me.accesstoken': xhrresponse.accesstoken 
                    }
                    console.log(localStorage)
                    if (xhrresponse.accesstoken != null) {
                        window.location.href = '/read'
                    }
                }
            }
            console.log(postData)
            xhr.send(JSON.stringify(postData))
        })
        buildObjectBindings(vjsObjects)
        document.getElementById("logoutFormLogoutButton").addEventListener('click', (e) => { checkLogout() })
    }
    xhr.send()
    
} else if (location.pathname.substring(0, 3) == "/me" && isLoggedIn()) {
    let xhr = xhrGet("/static/views/me.html")
    xhr.onload = () => {
        document.title = "About Me"
        document.getElementById("includedHtml").innerHTML = xhr.response;
        buildObjectBindings(vjsObjects)
        document.getElementById("logoutFormLogoutButton").addEventListener('click', (e) => { checkLogout() })
    }
    xhr.send()
} else if (location.pathname.substring(0, 1) == "/" || location.pathname.substring(0, 5) == "/blog"){
    getKeywords()
    getHtmlContents()
    let xhr = xhrGet("/static/views/index.html")
    if (location.pathname.substring(0, 5) == "/blog") {
        const queriedTitle = location.pathname.replace("/blog", "")
        xhr.onload = () => {
            document.title = "Welcome"
            document.getElementById("indexBlogPublicHtml").innerHTML = xhr.response;
            let contentTitles = ""
            const allhtmlcontents = JSON.parse(sessionStorage.getItem('allhtmlcontents'))
            console.log(allhtmlcontents)
            let xhr2 = xhrGet(('/api/htmlcontents/get/' + queriedTitle))
            xhr2.onload = () => {
                if (xhr2.readyState == 4) {
                    let xhr2response = JSON.parse(xhr2.response) 
                    console.log(xhr2response)
                    document.getElementById('content.selected.selected').innerHTML = xhr2response.content
                    // console.log(hljs)
                    hljs.highlightAll()
                }
            }
            xhr2.send()   
            for (let i=0;i<allhtmlcontents.length;i++) {
                contentTitles = contentTitles + "&nbsp;<a href='/blog/" + allhtmlcontents[i]['title'] + "' id='select-content-id-" + allhtmlcontents[i]['id'] + "'>" + allhtmlcontents[i]['title'] + "</a>&nbsp;"
            }
            document.getElementById("content.titles").innerHTML = contentTitles
            buildObjectBindings(vjsObjects)
            document.getElementById("logoutFormLogoutButton").addEventListener('click', (e) => { checkLogout() })
        }
        xhr.send()
    } else {
        xhr.onload = () => {
            document.title = "Welcome"
            document.getElementById("indexBlogPublicHtml").innerHTML = xhr.response;
            let contentTitles = ""
            const allhtmlcontents = JSON.parse(sessionStorage.getItem('allhtmlcontents'))
            const selectedContent = allhtmlcontents[(allhtmlcontents.length-1)]
            // console.log(selectedContent)
            console.log(allhtmlcontents)
            let xhr2 = xhrGet(('/api/htmlcontents/get/' + selectedContent.title))
            xhr2.onload = () => {
                if (xhr2.readyState == 4) {
                    let xhr2response = JSON.parse(xhr2.response) 
                    console.log(xhr2response)
                    document.getElementById('content.selected.selected').innerHTML = xhr2response.content
                    // console.log(hljs)
                    hljs.highlightAll()
                }
            }
            xhr2.send()   
            for (let i=0;i<allhtmlcontents.length;i++) {
                contentTitles = contentTitles + "&nbsp;<a href='/blog/" + allhtmlcontents[i]['title'] + "' id='select-content-id-" + allhtmlcontents[i]['id'] + "'>" + allhtmlcontents[i]['title'] + "</a>&nbsp;"
            }
            document.getElementById("content.titles").innerHTML = contentTitles
            buildObjectBindings(vjsObjects)
            document.getElementById("logoutFormLogoutButton").addEventListener('click', (e) => { checkLogout() })
        }
        xhr.send()
    }
} else {
    let xhr = xhrGet("/static/views/404.html")
    xhr.onload = () => {
        document.title = "Error: Resource Not Found"
        document.getElementById("includedHtml").innerHTML = xhr.response;
    }
    xhr.send()
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
window.addEventListener("load", () => {
    // Fully loaded!
    console.log("Fully loaded!")
    console.log(isLoggedIn())
});
