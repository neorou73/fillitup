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

const showLoginView = () => {
    document.getElementById("loginView").style.display = "inline"
    document.getElementById("logoutView").style.display = "none"
}

const showLogoutView = () => {
    document.getElementById("logoutView").style.display = 'inline'
    document.getElementById("loginView").style.display = 'none'
    document.getElementById("logoutFormLogoutButton").addEventListener('click', (e) => { checkLogout() })
}

const isLoggedIn = () => {
    console.log(localStorage)
    const status = localStorage.getItem('isLoggedIn')
    console.log(status)
    if (status == null) {
        console.log('not logged in')
        showLoginView()
        return false
    } else {
        console.log('is logged in')
        showLogoutView()   
        return true
    }
}

const showOneMainContent = (divIdName) => {
    document.getElementById("selectedBlog").style.display = 'none'
    Array.prototype.forEach.call(document.getElementsByClassName("mainContent"), (el) => {        
        if (el.id == divIdName) {
            document.getElementById(el.id).style.display = "inline" 
            console.log(el);
        } else {
            document.getElementById(el.id).style.display = 'none'
        }
    })
}

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

// jsonContent specifies if this is a json content type and therefore add it to request header
function makePostRequest (url, postdata, done) {
    let xhr = new XMLHttpRequest()
    xhr.open('POST', url, true)
    //Send the proper header information along with the request
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
        done(null, xhr.response);
    }
    xhr.onerror = function () {
        done(xhr.response);
    }
    xhr.send(JSON.stringify(postdata))
}

// checks to log out user
const checkLogout = () => {
    console.log('logging out, will redirect in 3 seconds')
    makeRequest('GET', "/logout", (err, xhrResponse) => { 
        if (err) { console.log(err) }
        console.log(xhrResponse)
        destroyAccessScope()
        setTimeout(function() {
            window.location.href = '/'
       }, 2500);
    })
}

// use this to define which blog to show
const showSelectedBlog = (selectedBlog) => {
    document.getElementById("listOfPublishedHtmlContentUrls").style.display = "inline"
    const url = "/api/htmlcontents/get/" + selectedBlog
    sessionStorage.setItem('selectedBlogTitle', selectedBlog)
    makeRequest('GET', url, (err, xhrResponse) => {
        const xr = JSON.parse(xhrResponse)
        console.log(xr)
        document.getElementById("selectedBlog").innerHTML = xr.content
        sessionStorage.setItem('selectedBlogContent', xr.content)
    })
}

// get list of keywords
makeRequest('GET', "/api/keywords/list", (err, xhrResponse) => {
    if (err) { throw err; }
    //console.log(xhrResponse)
    const allkeywords = JSON.parse(xhrResponse) 
    sessionStorage.setItem('allKeywords', allkeywords)
})

// get list of published html contents 
makeRequest('GET', "/api/htmlcontents/list", (err, xhrResponse) => {
    if (err) { throw err; }
    const allhtmlcontents = JSON.parse(xhrResponse) 
    sessionStorage.setItem('allHtmlContents', allhtmlcontents)
})

makeRequest('GET', "/static/views/index.html", (err, xhrResponse) => {
    if (err) { throw err; }
    document.getElementById("indexBlogPublicHtml").innerHTML = xhrResponse
})

makeRequest('GET', "/static/views/read.html", (err, xhrResponse) => {
    if (err) { throw err; }
    document.getElementById("readView").innerHTML = xhrResponse
})

makeRequest('GET', "/static/views/editor.html", (err, xhrResponse) => {
    if (err) { throw err; }
    document.getElementById("editorView").innerHTML = xhrResponse
})

makeRequest('GET', "/static/views/uploads.html", (err, xhrResponse) => {
    if (err) { throw err; }
    document.getElementById("uploadsView").innerHTML = xhrResponse
})

makeRequest('GET', "/static/views/keywords.html", (err, xhrResponse) => {
    if (err) { throw err; }
    document.getElementById("keywordsView").innerHTML = xhrResponse
})

makeRequest('GET', "/static/views/manage.html", (err, xhrResponse) => {
    if (err) { throw err; }
    document.getElementById("manageView").innerHTML = xhrResponse
})

makeRequest('GET', "/static/views/me.html", (err, xhrResponse) => {
    if (err) { throw err; }
    document.getElementById("meView").innerHTML = xhrResponse
})

makeRequest('GET', "/static/views/users.html", (err, xhrResponse) => {
    if (err) { throw err; }
    document.getElementById("usersView").innerHTML = xhrResponse
})

showOneMainContent("homeView")
const checkLogin = isLoggedIn()

if (checkLogin) {
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

    if (document.getElementById("loginView").style.display == 'inline') {
        console.log('login form is showing')
        if (document.getElementById('loginFormLoginButton')) {
            console.log('login button should exist')
            // listen to login button being clicked 
            document.getElementById('loginFormLoginButton').addEventListener('click', () => {
                console.log('trying to log in')
                console.log("login form clicked")
                const postData = {
                    "email": document.getElementById("loginFormEmail").value,
                    "password": document.getElementById("loginFormPassword").value
                }
                console.log(postData)
                makePostRequest('/login', postData, (err, xhrResponse) => {
                    if (err) { throw err; }
                    const xr = JSON.parse(xhrResponse)
                    console.log(xr)
                    //console.log(xr.accesstoken)
                    localStorage.setItem("email", xr.email)
                    localStorage.setItem("accesstoken", xr.accesstoken)
                    localStorage.setItem("isLoggedIn", true)
                    console.log(localStorage)
                    setTimeout(function() {
                        window.location.href = '/'
                   }, 2500);
                })
            })
        }
    }
}

Array.prototype.forEach.call(document.getElementsByClassName("topnavAlwaysShow"), (el) => {
    // Do stuff here
    el.style.display = 'inline'
    el.addEventListener('click', (event) => {
        console.log(event.target.id)
        showOneMainContent(event.target.id.replace("show_",""))
    })
})

showSelectedBlog('curriculum-vitae')

const buildMainContentNav = () => {
    const allKeywords = sessionStorage.getItem('allKeywords')
    const allHtmlContents = sessionStorage.getItem('allHtmlContents')
    const selectedBlogTitle = sessionStorage.getItem('selectedBlogTitle')
    const selectedBlogContent = sessionStorage.getItem('selectedBlogContent')
    
    document.getElementById("listOfPublishedHtmlContentUrls").innerHTML = ""
    let publishedHtmlContents = []
    for (let c=0;c<allHtmlContents.length;c++) {
        if (allHtmlContents[c]['published']) {
            publishedHtmlContents.push(allHtmlContents[c])

            const tag = document.createElement("span");
            const text = document.createTextNode((" " + allHtmlContents[c]['title'] + " "))
            tag.appendChild(text);
            const element = document.getElementById("listOfPublishedHtmlContentUrls");
            element.appendChild(tag);
        }
    }
}

window.addEventListener("load", () => {
    // Fully loaded!
    console.log("Fully loaded!")
    //console.log(isLoggedIn())
    document.title = "Fill It Up!"
})

/**
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

/**
 * if (location.pathname == "/editor") {
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
            }
        }
        xhr2.onerror = (e) => {
            console.log(e)
        }
        xhr2.send()
    }
 */


/*
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
*/

/*
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
*/

/*
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
*/

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
})
*/