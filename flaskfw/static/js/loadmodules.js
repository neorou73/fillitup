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

const isLoggedIn = () => {
    console.log(localStorage)
    const status = localStorage.getItem('isLoggedIn')
    console.log(status)
    if (status == null) {
        console.log('not logged in')
        return false
    } else {
        console.log('is logged in')
        return true
    }
}
//isLoggedIn()

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

const showOneMainContent = (divIdName) => {
    Array.prototype.forEach.call(document.getElementsByClassName("mainContent"), (el) => {        
        if (el.id == divIdName) {
            document.getElementById(el.id).style.display = "inline" 
            console.log(el);
        } else {
            document.getElementById(el.id).style.display = 'none'
        }
    })
}

const getHtmlView = (viewUrl, cb) => {
    let xhr = xhrGet(viewUrl)
    xhr.onload = () => {
        cb(null, xhr.response)
    }
    xhr.send()
}

/*
getKeywords()
getFileUploads()
getUsers()
getHtmlContents()
*/

function makeRequest (method, url, done) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onload = function () {
        done(null, xhr.response);
    };
    xhr.onerror = function () {
        done(xhr.response);
    };
    xhr.send();
}

// get list of keywords
makeRequest('GET', "/api/keywords/list", (err, xhrResponse) => {
    if (err) { throw err; }
    //console.log(xhrResponse)
    const allkeywords = JSON.parse(xhrResponse) 
    let keywords = ""
    for (let i=0;i<allkeywords.length;i++) {
        keywords = keywords + "&nbsp;<a href='#'>" + allkeywords[i]['name'] + "</a>&nbsp;"
    }
    document.getElementById("listOfKeywords").innerHTML = keywords
})

// get list of published html contents 
makeRequest('GET', "/api/htmlcontents/list", (err, xhrResponse) => {
    if (err) { throw err; }
    //console.log(xhrResponse)
    const allhtmlcontents = JSON.parse(xhrResponse) 
    let publishedhtmlcontents = []
    let contentTitles = ""
    allhtmlcontents.forEach(element => {
        if (element.published) {
            publishedhtmlcontents.push(element)
        }
    })
    for (let i=0;i<publishedhtmlcontents.length;i++) {
        contentTitles = contentTitles + "&nbsp;<a href='/blog/" + publishedhtmlcontents[i]['title'] + "' id='select-content-id-" + publishedhtmlcontents[i]['id'] + "'>" + publishedhtmlcontents[i]['title'] + "</a>&nbsp;"
    }
    document.getElementById("listOfPublishedHtmlContentUrls").innerHTML = contentTitles
})

makeRequest('GET', "/static/views/index.html", (err, xhrResponse) => {
    if (err) { throw err; }
    document.title = "Welcome"
    document.getElementById("indexBlogPublicHtml").innerHTML = xhrResponse
    /*let xhr2 = xhrGet(('/api/htmlcontents/get/' + queriedTitle))
    xhr2.onload = () => {
        if (xhr2.readyState == 4) {
            let xhr2response = JSON.parse(xhr2.response) 
            console.log(xhr2response)
            document.getElementById('content.selected.selected').innerHTML = xhr2response.content
            // console.log(hljs)
            hljs.highlightAll()
        }
    }
    xhr2.send()   */
    
})

/**
 * 
 */

makeRequest('GET', "/static/views/read.html", (err, xhrResponse) => {
    if (err) { throw err; }
    
    document.title = "Read Content"
    document.getElementById("readView").innerHTML = xhrResponse;
    const allhtmlcontents = JSON.parse(sessionStorage.getItem('allhtmlcontents'))
    console.log(allhtmlcontents)
    document.getElementById("allhtmlcontentslist").innerHTML = buildHtmlTable(Object.keys(allhtmlcontents[0]), allhtmlcontents, true)
    
    /*if (location.pathname == "/read") {
        buildObjectBindings(vjsObjects)
        document.getElementById("content-exists-to-read").setAttribute("display", "none")
        console.log(hljs)
        hljs.highlightAll()
        document.getElementById("logoutFormLogoutButton").addEventListener('click', (e) => { checkLogout() })
    } else {
        const queriedTitle = location.pathname.replace("/read/","")
        const queriedContentUrl = '/api/htmlcontents/get/' + queriedTitle 
        makeRequest('GET', queriedContentUrl, (err, xhrResponse2) => {
            let xhr2response = JSON.parse(xhrResponse2) 
            console.log(xhr2response)
            if (xhr2response.hasOwnProperty('title') && xhr2response.hasOwnProperty('content')) {
                document.getElementById('htmlcontent.content').innerHTML = xhr2response.content
            }
            document.getElementById('htmlcontent.title').innerText = queriedTitle                    
            buildObjectBindings(vjsObjects)
            console.log(hljs)
            hljs.highlightAll()
        })
    }*/
})

makeRequest('GET', "/static/views/editor.html", (err, xhrResponse) => {
    if (err) { throw err; }
    if (location.pathname == "/editor") {
        window.location.replace(location.origin + "/read")
    } else {
        const queriedTitle = location.pathname.replace("/editor/","")
        const allkeywords = JSON.parse(sessionStorage.getItem('allkeywords'))
        console.log(allkeywords)
        let keywordSpans = ""
        if (allkeywords) {
            for (let k=0;k<allkeywords.length;k++) {
                keywordSpans = keywordSpans + "<span class='keywordClick'>| " + allkeywords[k]['name'] + " |</span>"
            }
        }
        document.title = "Edit Content"
        document.getElementById("editorView").innerHTML = xhrResponse
        let xhr2 = xhrGet(('/api/htmlcontents/get/' + queriedTitle))
        xhr2.onload = () => {
            console.log(xhr2)
            document.getElementById('keywordSpans').innerHTML = keywordSpans
            if (xhr2.readyState == 4 && xhr2.status == 200) {
                let xhr2response = JSON.parse(xhr2.response) 
                console.log(xhr2response)
                if (xhr2response.hasOwnProperty('title') && xhr2response.hasOwnProperty('markdownst')) {
                    document.getElementById('htmlcontent.markdownst').value = xhr2response.markdownst
                    document.getElementById('htmlcontent.keywords').value = xhr2response.meta.keywords.join('; ')
                }
                if (xhr2response.published) {
                    document.getElementById('htmlcontent.published.true').checked = true
                    document.getElementById('htmlcontent.published.false').checked = false
                } else {
                    document.getElementById('htmlcontent.published.true').checked = false
                    document.getElementById('htmlcontent.published.false').checked = true
                }
                document.getElementById('htmlcontent.published.true').addEventListener('change', (ele) => {
                    if (document.getElementById('htmlcontent.published.true').checked) {
                        document.getElementById('htmlcontent.published.false').checked = false
                    }
                })
                document.getElementById('htmlcontent.published.false').addEventListener('change', (ele) => {
                    if (document.getElementById('htmlcontent.published.false').checked) {
                        document.getElementById('htmlcontent.published.true').checked = false
                    }
                })
                
                document.getElementById('htmlcontent.title').innerText = queriedTitle
                document.getElementById('htmlcontent.link').innerHTML = "<a href='/read/" + queriedTitle + "'>read</a>"
                document.getElementById('htmlcontent.save').addEventListener('click', () => {
                    let publishStatus = false 
                    if (document.getElementById('htmlcontent.published.true').checked) {
                        publishStatus = true
                    }
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
                        },
                        "published": publishStatus
                    }
                    updateHtmlContentPost(htmlContentData)
                })
                buildObjectBindings(vjsObjects)
                document.getElementById("logoutFormLogoutButton").onclick = (e) => { checkLogout() }
            } else {
                
                if (xhr2response.published) {
                    document.getElementById('htmlcontent.published.true').checked = true
                    document.getElementById('htmlcontent.published.false').checked = false
                } else {
                    document.getElementById('htmlcontent.published.true').checked = false
                    document.getElementById('htmlcontent.published.false').checked = true
                }
                document.getElementById('htmlcontent.published.true').addEventListener('change', (ele) => {
                    if (document.getElementById('htmlcontent.published.true').checked) {
                        document.getElementById('htmlcontent.published.false').checked = false
                    }
                })
                document.getElementById('htmlcontent.published.false').addEventListener('change', (ele) => {
                    if (document.getElementById('htmlcontent.published.false').checked) {
                        document.getElementById('htmlcontent.published.true').checked = false
                    }
                })
                document.getElementById('htmlcontent.title').innerText = queriedTitle
                document.getElementById('htmlcontent.link').innerHTML = "<a href='/read/" + queriedTitle + "'>read</a>"
                document.getElementById('htmlcontent.keywords').value = "general; test"
                document.getElementById('htmlcontent.save').addEventListener('click', () => {
                    let publishStatus = false 
                    if (document.getElementById('htmlcontent.published.true').checked) {
                        publishStatus = true
                    }
                    console.log(keywordsInput)
                    console.log(keywordsInput.split("; "))
                    const mdData = translateMdInput(document.getElementById('htmlcontent.markdownst').value)
                    const htmlContentData = {
                        "title": queriedTitle,
                        "markdownst": document.getElementById('htmlcontent.markdownst').value,
                        "content": mdData,
                        "meta": { 
                            "keywords": keywordsInput.split(";")
                        },
                        "published": publishStatus
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
})

makeRequest('GET', "/static/views/uploads.html", (err, xhrResponse) => {
    if (err) { throw err; }
    document.title = "File Uploads"
    document.getElementById("uploadsView").innerHTML = xhrResponse
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
})

makeRequest('GET', "/static/views/keywords.html", (err, xhrResponse) => {
    if (err) { throw err; }
    document.title = "keywords"  
    document.getElementById("keywordsView").innerHTML = xhrResponse
    /*const allkeywords = JSON.parse(sessionStorage.getItem('allkeywords'))
    document.getElementById("allkeywordslist").innerHTML = buildHtmlTable(Object.keys(allkeywords[0]), allkeywords, false)
    document.getElementById('keyword.add').addEventListener('click', () => {
        const keywordData = {
            "name": document.getElementById('keyword.add.keyword').value,
            "description": document.getElementById('keyword.add.description').value
        }
        addKeywordPost(keywordData)
    })
    buildObjectBindings(vjsObjects)
    document.getElementById("logoutFormLogoutButton").onclick = (e) => { checkLogout() }*/
})

makeRequest('GET', "/static/views/manage.html", (err, xhrResponse) => {
    if (err) { throw err; }
    document.title = "Manage System"
    document.getElementById("manageView").innerHTML = xhrResponse
})

makeRequest('GET', "/static/views/me.html", (err, xhrResponse) => {
    if (err) { throw err; }
    document.title = "About Me"
    document.getElementById("meView").innerHTML = xhrResponse
})

makeRequest('GET', "/static/views/users.html", (err, xhrResponse) => {
    if (err) { throw err; }
    document.title = "Manage Users"
    document.getElementById("usersView").innerHTML = xhrResponse
    /*const allusers = JSON.parse(sessionStorage.getItem('allusers'))
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
    document.getElementById("logoutFormLogoutButton").addEventListener('click', (e) => { checkLogout() })*/
})

makeRequest('GET', "/static/views/auth.html", (err, xhrResponse) => {
    if (err) { throw err; }
    document.title = "Login"
    document.getElementById("loginView").innerHTML = xhrResponse;
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
})

/*
makeRequest('GET', "/static/views/blog.html", (err, xhrResponse) => {
    if (err) { throw err; }
    document.title = "Welcome"
    document.getElementById("indexBlogPublicHtml").innerHTML = xhrResponse;
    let contentTitles = ""
    const allhtmlcontents = JSON.parse(sessionStorage.getItem('allhtmlcontents'))
    // console.log(selectedContent)
    console.log(allhtmlcontents)
    let publishedhtmlcontents = []
    allhtmlcontents.forEach(element => {
        if (element.published) {
            publishedhtmlcontents.push(element)
        }
    });
    const selectedContent = publishedhtmlcontents[(publishedhtmlcontents.length-1)]
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
    for (let i=0;i<publishedhtmlcontents.length;i++) {
        contentTitles = contentTitles + "&nbsp;<a href='/blog/" + publishedhtmlcontents[i]['title'] + "' id='select-content-id-" + publishedhtmlcontents[i]['id'] + "'>" + publishedhtmlcontents[i]['title'] + "</a>&nbsp;"
    }
    document.getElementById("content.titles").innerHTML = contentTitles
    buildObjectBindings(vjsObjects)
})*/

makeRequest('GET', "/static/views/404.html", (err, xhrResponse) => {
    if (err) { throw err; }
    document.title = "Error!"
})

showOneMainContent("homeView")

if (isLoggedIn()) {
    Array.prototype.forEach.call(document.getElementsByClassName("topnavWhenLoggedIn"), (el) => {
        // Do stuff here
        el.style.display = 'inline'
        el.addEventListener('click', (event) => {
            console.log(event.target.id)
            showOneMainContent(event.target.id.replace("show_",""))
        })
    })
    Array.prototype.forEach.call(document.getElementsByClassName("topnavWhenLoggedOut"), (el) => {
        // Do stuff here
        el.style.display = 'none'
    })
} else {
    Array.prototype.forEach.call(document.getElementsByClassName("topnavWhenLoggedIn"), (el) => {
        // Do stuff here
        el.style.display = 'none'
    })
    Array.prototype.forEach.call(document.getElementsByClassName("topnavWhenLoggedOut"), (el) => {
        // Do stuff here
        el.style.display = 'inline'
        el.addEventListener('click', (event) => {
            console.log(event.target.id)
            showOneMainContent(event.target.id.replace("show_",""))
        })
    })
}

Array.prototype.forEach.call(document.getElementsByClassName("topnavAlwaysShow"), (el) => {
    // Do stuff here
    el.style.display = 'inline'
    el.addEventListener('click', (event) => {
        console.log(event.target.id)
        showOneMainContent(event.target.id.replace("show_",""))
    })
})

/*if (location.pathname.substring(0, 9) == "/keywords" && isLoggedIn()) {
    showOneMainContent('keywordsView')
} else if (location.pathname.substring(0, 8) == "/uploads" && isLoggedIn()) {
    showOneMainContent('uploadsView')
} else if (location.pathname.substring(0, 7) == "/editor" && isLoggedIn()) {
    showOneMainContent('editorView')
} else if (location.pathname.substring(0, 5) == "/read" && isLoggedIn()) {
    console.log(localStorage)
    showOneMainContent('readView')
} else if (location.pathname.substring(0, 7) == "/manage" && isLoggedIn()) {
    showOneMainContent('manageView')
} else if (location.pathname.substring(0, 6) == "/users" && isLoggedIn()) {
    showOneMainContent('usersView')
} else if (location.pathname.substring(0, 5) == "/auth" && isLoggedIn()) {
    console.log('you are logged in')
    window.location.href = '/read'
} else if (location.pathname.substring(0, 5) == "/auth" && !isLoggedIn()) {
    console.log('you are not logged in')   
    showOneMainContent('loginView') 
} else if (location.pathname.substring(0, 3) == "/me" && isLoggedIn()) {
    showOneMainContent('meView')
} else if (location.pathname == "/" || location.pathname.substring(0, 5) == "/blog"){
    if (isLoggedIn()) {
        showOneMainContent('homeIndex')
    } else {
        showOneMainContent('readView')
    }
} else {
    showPublicNav()
}*/

window.addEventListener("load", () => {
    // Fully loaded!
    console.log("Fully loaded!")
    //console.log(isLoggedIn())
})


/*
function makeRequest (method, url, done) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onload = function () {
        done(null, xhr.response);
    };
    xhr.onerror = function () {
        done(xhr.response);
    };
    xhr.send();
}
// And we'd call it as such:
makeRequest('GET', 'http://example.com', function (err, datums) {
    if (err) { throw err; }
    console.log(datums);
});
*/