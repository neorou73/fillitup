import {test } from './modules/apiCalls.js'
//import {test, getUsers, getFileUploads, getHtmlContents, xhrGet, xhrPost, addUserPost, addKeywordPost, addHtmlContentPost, addFileUploadPost, updateHtmlContentPost } from './modules/apiCalls.js'
//import {evaluateString, valuateVjsFors, translateMdInput, buildObjectBindings, buildHtmlTable} from './modules/dataBindings.js'

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

const showLoggedInNavigation = () => {
    Array.prototype.forEach.call(document.getElementsByClassName("topnavWhenLoggedIn"), (el) => {
        // Do stuff here
        el.style.display = 'inline'
    })
    Array.prototype.forEach.call(document.getElementsByClassName("topnavWhenLoggedOut"), (el) => {
        // Do stuff here
        el.style.display = 'none'
    })
    Array.prototype.forEach.call(document.getElementsByClassName("topnavAlwaysShow"), (el) => {
        // Do stuff here
        el.style.display = 'inline'
    })
}

const showLoggedOutNavigation = () => {
    Array.prototype.forEach.call(document.getElementsByClassName("topnavWhenLoggedIn"), (el) => {
        // Do stuff here
        el.style.display = 'none'
    })
    Array.prototype.forEach.call(document.getElementsByClassName("topnavWhenLoggedOut"), (el) => {
        // Do stuff here
        el.style.display = 'inline'
    })
    Array.prototype.forEach.call(document.getElementsByClassName("topnavAlwaysShow"), (el) => {
        // Do stuff here
        el.style.display = 'inline'
    })
}

/*const showOneMainContent = (divIdName) => {
    document.getElementById("selectedBlog").style.display = 'none'
    Array.prototype.forEach.call(document.getElementsByClassName("mainContent"), (el) => {        
        if (el.id == divIdName) {
            document.getElementById(el.id).style.display = "inline" 
            console.log(el);
        } else {
            document.getElementById(el.id).style.display = 'none'
        }
    })
}*/

const makeRequest = (method, url, done) => {
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
const makePostRequest = (url, postdata, done) => {
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

/*
// determine which view to load 
const setView = (viewTitle) => {
    if (viewTitle.substring(0, 3) == 'hc-') {
        const hcTitle = viewTitle.substring(2, viewTitle.length)
        showSelectedBlog(hcTitle)
    } else {
        // look for other views for login 
    }
}
*/

/*
// use this to define which blog to show
const showSelectedBlog = (selectedBlog) => {
    const url = "/api/htmlcontents/get/" + selectedBlog
    sessionStorage.setItem('selectedBlogTitle', selectedBlog)
    makeRequest('GET', url, (err, xhrResponse) => {
        const xr = JSON.parse(xhrResponse)
        console.log(xr)
        document.getElementById("selectedBlog").innerHTML = xr.content
        sessionStorage.setItem('selectedBlogContent', xr.content)
    })
}
*/

/*makeRequest('GET', "/static/views/users.html", (err, xhrResponse) => {
    if (err) { throw err; }
    document.getElementById("usersView").innerHTML = xhrResponse
})*/

// divId would be either publishedHtmlContentUrls1 or publishedHtmlContentUrls2
const showHtmlContentTitlesList = (divId) => {
    // get list of published html contents 
    makeRequest('GET', "/api/htmlcontents/list", (err, xhrResponse) => {
        sessionStorage.removeItem('allHtmlContents')
        if (err) { throw err; }
        const allHtmlContents = JSON.parse(xhrResponse)
        if (allHtmlContents.length > 0) {
            let publishedHtmlContents = []
            document.getElementById(divId).innerHTML = ""
            for (let c=0;c<allHtmlContents.length;c++) {
                if (allHtmlContents[c]['published']) {
                    publishedHtmlContents.push(allHtmlContents[c])
    
                    const tag = document.createElement("span")
                    tag.classList.add("html-content-selector")
                    const text = document.createTextNode((". " + allHtmlContents[c]['title'] + " ."))
                    tag.appendChild(text)
                    const element = document.getElementById(divId)
                    element.appendChild(tag)
                    tag.addEventListener('click', (buttonElement) => {
                        const selectedHtmlContentTitle = (buttonElement.target.innerText).replace(". ","").replace(" .","")
                        console.log(selectedHtmlContentTitle)
                        location.href = "/blog/" + selectedHtmlContentTitle
                    })
                }
            }
            console.log(publishedHtmlContents)
        }
    })
}


const locPath = location.pathname 
console.log(locPath)

for (const mc of document.getElementsByClassName("mainContent")) {
    mc.style.display = "none"
}

const checkLogin = isLoggedIn()

document.getElementById("logoutView").style.display = "none"
document.getElementById("loginView").style.display = 'none'

if (locPath == "/auth") {
    // determine if logged in or not, if yes show login if no show show logout
    // show me profile if logged in, along with change password
    document.getElementById("meView").style.display = "block"   

    if (checkLogin) {
        document.getElementById("logoutView").style.display = 'block'
        document.getElementById("logoutFormLogoutButton").addEventListener('click', (e) => { checkLogout() })
        showLoggedInNavigation()
    } else {
        document.getElementById("loginView").style.display = "block"
        showLoggedOutNavigation()
        if (document.getElementById("loginView").style.display == 'block') {
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
                            window.location.href = "/manage"
                       }, 2500);
                    })
                })
            }
        }
    }
}
else if (locPath.substring(0, 6) == "/blog/") {
    // show the blog 
    document.getElementById("readView").style.display = 'block'
    const selectedBlogTitle = locPath.substring(6, locPath.length)
    console.log(selectedBlogTitle)
    const url = "/api/htmlcontents/get/" + selectedBlogTitle
    makeRequest('GET', url, (err, xhrResponse) => {
        const xr = JSON.parse(xhrResponse)
        console.log(xr)
        document.getElementById("selectedBlogTitle").innerHTML = selectedBlogTitle
        document.getElementById("selectedBlogContent").innerHTML = xr.content
        showHtmlContentTitlesList("publishedHtmlContentUrls2")
        if (checkLogin) {
            showLoggedInNavigation()
        } else {
            showLoggedOutNavigation()
        }
    })
} 
else if (locPath.substring(0, 8) == "/editor/") {
    if (checkLogin) {
        // show editor
        document.getElementById("editorView").style.display = "block"
        showLoggedInNavigation()
    } else {
        window.location.href = "/auth"
    }
} 
else if (locPath.substring(0, 9) == "/keywords") {
    makeRequest('GET', "/api/keywords/list", (err, xhrResponse) => {
        if (err) { throw err; }
        const allKeywords = JSON.parse(xhrResponse)
        console.log(allKeywords) 
        console.log(allKeywords.length) 
        if (allKeywords.length > 0) {
            // get list of keywords
            let keywords = []
            document.getElementById("listKeywordsView").innerHTML = ""
            for (let k=0;k<allKeywords.length;k++) {
                keywords.push(allKeywords[k])

                const tag = document.createElement("span")
                tag.classList.add("keyword-selector")
                const text = document.createTextNode(allKeywords[k]['name'])
                tag.appendChild(text)
                const element = document.getElementById("listKeywordsView")
                element.appendChild(tag)
                tag.addEventListener('click', (buttonElement) => {
                    const selectedKeyword = (buttonElement.target.innerText)
                    console.log(selectedKeyword)
                })
            }
            // show upload
            document.getElementById("listKeywordsView").style.display = "block"
        }
        if (checkLogin) {
            showLoggedInNavigation()
        } else {
            showLoggedOutNavigation()
        }
    })
} 
else if (locPath.substring(0, 8) == "/uploads") {
    if (checkLogin) {
        // show upload
        document.getElementById("uploadsView").style.display = "block"
        showLoggedInNavigation()
    } else {
        window.location.href = "/auth"
    }
} 
else if (locPath.substring(0, 7) == "/manage") {
    if (checkLogin) {
        // show manage css and keywords
        document.getElementById("manageKeywordsView").style.display = "block"
        document.getElementById("manageView").style.display = "block" 
        showLoggedInNavigation()
    }
    else {
        window.location.href = "/auth"
    }
} 
else {
    // show front page
    document.getElementById("homeView").style.display = "block"
    showHtmlContentTitlesList("publishedHtmlContentUrls1")    
    if (checkLogin) {
        showLoggedInNavigation()
    } else {
        showLoggedOutNavigation()
    }
}

// check window loading status
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