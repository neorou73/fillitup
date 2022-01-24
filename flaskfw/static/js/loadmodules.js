import { test, addKeywordPost, addHtmlContentPost, addFileUploadPost, updateHtmlContentPost } from './modules/apiCalls.js'
//import {test, getUsers, getFileUploads, getHtmlContents, xhrGet, xhrPost, addUserPost, addKeywordPost, addHtmlContentPost, addFileUploadPost, updateHtmlContentPost } from './modules/apiCalls.js'
//import {evaluateString, valuateVjsFors, translateMdInput, buildObjectBindings, buildHtmlTable} from './modules/dataBindings.js'
import { translateMdInput, buildHtmlTable } from './modules/dataBindings.js'

console.log(test())

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

/*makeRequest('GET', "/static/views/users.html", (err, xhrResponse) => {
    if (err) { throw err; }
    document.getElementById("usersView").innerHTML = xhrResponse
})*/
const showHtmlContentList = (publishStatus, divId) => {
    // get list of published html contents 
    makeRequest('GET', "/api/htmlcontents/list", (err, xhrResponse) => {
        sessionStorage.removeItem('allHtmlContents')
        if (err) { throw err; }
        const allHtmlContents = JSON.parse(xhrResponse)
        console.log(allHtmlContents)
        if (publishStatus) {
            for (let c=0;c<allHtmlContents.length;c++) {
                if (allHtmlContents[c]['published']) {
                    const link = document.createElement("a")
                    link.setAttribute("href", ("/blog/" + allHtmlContents[c]['title']))
                    link.innerText = allHtmlContents[c]['title']                             
                    const span = document.createElement("span")
                    span.classList.add("html-content-selector")
                    span.appendChild(link)
                    const element = document.getElementById(divId)
                    element.appendChild(span)
                }
            }
        } else {
            // show all
            for (let c=0;c<allHtmlContents.length;c++) {
                const link = document.createElement("a")
                link.setAttribute("href", ("/editor/" + allHtmlContents[c]['title']))
                if (allHtmlContents[c]['published']) {
                    link.innerText = allHtmlContents[c]['title'] + "; created: " + allHtmlContents[c]['created'] + " (published)"
                } else {
                    link.innerText = allHtmlContents[c]['title'] + "; created: " + allHtmlContents[c]['created'] 
                }                
                const div = document.createElement("div")
                //div.appendChild(innerSpan)
                div.appendChild(link)
                const element = document.getElementById(divId)
                element.appendChild(div)
            } 
            //console.log(htmlContentsList)
            // document.getElementById(divId).innerHTML = htmlContentsList
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
    if (checkLogin) {
        document.getElementById("meView").style.display = "block" 
        document.getElementById("logoutView").style.display = 'block'
        document.getElementById("logoutFormLogoutButton").addEventListener('click', (e) => { checkLogout() })
        makeRequest('GET', "/api/me", (err, xhrResponse) => {
            if (err) { console.log(err); }
            const ud = JSON.parse(xhrResponse)
            document.getElementById("me.email").value = ud.email
            document.getElementById("me.username").value = ud.username
            
            const postUrl = "/api/users/edit"
            document.getElementById("me.email.save").addEventListener("click", () => {
                // attempt to save the new email address
                console.log("updating email address")
                const postData = { 
                    "what": "change_email", 
                    "newemail": (document.getElementById("me.email").value), 
                    "oldemail": ud.email
                }
                makePostRequest(postUrl, postData, (err, xhrResponse2) => {
                    if (err) { console.log(err); }
                    const xr = JSON.parse(xhrResponse2)
                    console.log(xr)
                    const parentElement = document.getElementById('me.email.save').parentNode
                    if (xr.hasOwnProperty("email")) {
                        sessionStorage.setItem("email", xr.email)
                    } else {
                        if (xr.hasOwnProperty('error')) {
                            const errorElement = document.createElement('div')
                            errorElement.setAttribute("class", "error-message")
                            errorElement.innerText = xr.error
                            parentElement.appendChild(errorElement)
                        }
                        if (xr.hasOwnProperty('description')) {
                            const errorElement = document.createElement('div')
                            errorElement.setAttribute("class", "error-message")
                            errorElement.innerText = xr.description
                            parentElement.appendChild(errorElement)
                        }
                    }
                })
            })
            document.getElementById("me.username.save").addEventListener("click", () => {
                // attempt to save the new username
                console.log("updating username")
                const postData = { 
                    "what": "change_username", 
                    "email": ud.email,
                    "newusername": (document.getElementById("me.username").value), 
                    "oldusername": ud.username
                }
                makePostRequest(postUrl, postData, (err, xhrResponse2) => {
                    if (err) { console.log(err); }
                    const xr = JSON.parse(xhrResponse2)
                    console.log(xr)
                    const parentElement = document.getElementById('me.username.save').parentNode
                    if (xr.hasOwnProperty("username")) {
                        sessionStorage.setItem("email", xr.email)
                        sessionStorage.setItem("username", xr.username)
                    } else {
                        if (xr.hasOwnProperty('error')) {
                            const errorElement = document.createElement('div')
                            errorElement.setAttribute("class", "error-message")
                            errorElement.innerText = xr.error
                            parentElement.appendChild(errorElement)
                        }
                        if (xr.hasOwnProperty('description')) {
                            const errorElement = document.createElement('div')
                            errorElement.setAttribute("class", "error-message")
                            errorElement.innerText = xr.description
                            parentElement.appendChild(errorElement)
                        }
                    }
                })
            })
            document.getElementById("me.password.save").addEventListener("click", () => {
                // attempt to save the new password
                console.log("updating password address")
                const postData = { 
                    "what": "change_password", 
                    "oldpassword": (document.getElementById("me.password.now").value), 
                    "newpassword1": (document.getElementById("me.password.new1").value), 
                    "newpassword2": (document.getElementById("me.password.new2").value), 
                    "email": ud.email
                }
                makePostRequest(postUrl, postData, (err, xhrResponse2) => {
                    if (err) { console.log(err); }
                    const xr = JSON.parse(xhrResponse2)
                    console.log(xr)
                    const parentElement = document.getElementById('me.password.save').parentNode
                    if (xr.hasOwnProperty("email")) {
                        sessionStorage.setItem("email", xr.email)
                    } else {                        
                        if (xr.hasOwnProperty('error')) {
                            const errorElement = document.createElement('div')
                            errorElement.setAttribute("class", "error-message")
                            errorElement.innerText = xr.error
                            parentElement.appendChild(errorElement)
                        }
                        if (xr.hasOwnProperty('description')) {
                            const errorElement = document.createElement('div')
                            errorElement.setAttribute("class", "error-message")
                            errorElement.innerText = xr.description
                            parentElement.appendChild(errorElement)
                        }
                    }
                })
            })
        })
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
                        if (xr.hasOwnProperty('accesstoken') && xr.hasOwnProperty('email')) {
                            console.log(xr.accesstoken)
                            localStorage.setItem("email", xr.email)
                            localStorage.setItem("accesstoken", xr.accesstoken)
                            localStorage.setItem("isLoggedIn", true)
                            console.log(localStorage)
                            setTimeout(function() {
                                window.location.href = "/auth"
                            }, 2500);
                        } else {
                            if (xr.hasOwnProperty('error')) {
                                const errorElement = document.createElement('div')
                                errorElement.setAttribute("class", "error-message")
                                errorElement.innerText = xr.error
                                document.getElementById('loginView').appendChild(errorElement)
                            }
                            if (xr.hasOwnProperty('description')) {
                                const errorElement = document.createElement('div')
                                errorElement.setAttribute("class", "error-message")
                                errorElement.innerText = xr.description
                                document.getElementById('loginView').appendChild(errorElement)
                            }
                        }
                        
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
        showHtmlContentList(true, "publishedHtmlContentUrls2")
        if (checkLogin) {
            const editButtonElement = document.createElement("button")
            const text = document.createTextNode("edit")
            editButtonElement.appendChild(text)
            document.getElementById("selectedBlogEdit").appendChild(editButtonElement)
            editButtonElement.addEventListener('click', () => {
                window.location.href = '/editor/' + selectedBlogTitle
            })
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
        const selectedBlogTitle = locPath.substring(8, locPath.length)
        console.log(selectedBlogTitle)
        const url = "/api/htmlcontents/get/" + selectedBlogTitle
        const postUrl = "/api/editor/" + selectedBlogTitle
        showHtmlContentList(false, "listHtmlContents")
        makeRequest('GET', url, (err, xhrResponse) => {
            const xr = JSON.parse(xhrResponse)
            console.log(xr)
            if (xr.hasOwnProperty('code') && xr.code == '404') {
                // new form 
                document.getElementById('htmlcontent.save').addEventListener('click', () => {
                    let publishStatus = false 
                    if (document.getElementById('htmlcontent.published.true').checked) {
                        publishStatus = true
                    }
                    const keywordsInput = (document.getElementById("htmlcontent.keywords").value).split("; ")
                    console.log(keywordsInput)
                    const mdData = translateMdInput(document.getElementById('htmlcontent.markdownst').value)
                    const htmlContentData = {
                        "title": selectedBlogTitle,
                        "markdownst": document.getElementById('htmlcontent.markdownst').value,
                        "content": mdData,
                        "meta": { 
                            "keywords": keywordsInput
                        },
                        "published": publishStatus
                    }
                    makePostRequest(postUrl, htmlContentData, (err2, xhrResponse2) => {
                        if (err2) { console.log(err2) }
                        console.log(xhrResponse2)
                        document.getElementById('htmlcontent.link').innerHTML = "<a href='/blog/" + selectedBlogTitle + "'>read</a>"
                    })
                })
            } else {
                document.getElementById("htmlcontent.title").innerHTML = selectedBlogTitle
                document.getElementById("htmlcontent.markdownst").value = xr.markdownst
                const keywordsArray = xr.meta.keywords
                const publishedStatus = xr.published
                if (publishedStatus) {
                    document.getElementById('htmlcontent.published.true').checked = true
                    document.getElementById('htmlcontent.published.false').checked = false
                } else {
                    document.getElementById('htmlcontent.published.true').checked = false
                    document.getElementById('htmlcontent.published.false').checked = true
                }
                document.getElementById("htmlcontent.keywords").value = keywordsArray.join("; ")
                showHtmlContentList(true, "publishedHtmlContentUrls2")
                showLoggedInNavigation()
                // listen to save click event 
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
                        "title": selectedBlogTitle,
                        "markdownst": document.getElementById('htmlcontent.markdownst').value,
                        "content": mdData,
                        "meta": { 
                            "keywords": keywordsInput.split("; ")
                        },
                        "published": publishStatus
                    }
                    makePostRequest(postUrl, htmlContentData, (err2, xhrResponse2) => {
                        if (err2) { console.log(err2) }
                        console.log(xhrResponse2)
                        document.getElementById('htmlcontent.link').innerHTML = "<a href='/blog/" + selectedBlogTitle + "'>read</a>"
                    })
                })
            }            
        })
    } else {
        window.location.href = "/auth"
    }
} 
else if (locPath.substring(0, 8) == "/uploads") {
    if (checkLogin) {
        // show upload
        document.getElementById("uploadsView").style.display = "block"
        makeRequest('GET', "/api/fileuploads/list", (err, xhrResponse) => {
            const allfileuploads = JSON.parse(xhrResponse)
            console.log(allfileuploads)
            if (allfileuploads.length > 0) {
                const ulElement = document.createElement("ul")
                for (let l=0;l<allfileuploads.length;l++) {
                    const liElement = document.createElement("li")
                    const insideText = document.createTextNode(allfileuploads[l].filename)
                    liElement.appendChild(insideText)
                    ulElement.appendChild(liElement)
                }
                document.getElementById("uploadedfileslist").appendChild(ulElement)
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
            showLoggedInNavigation()
        })
    } else {
        window.location.href = "/auth"
    }
} 
else if (locPath.substring(0, 7) == "/manage") {
    if (checkLogin) {
        // show manage css and keywords
        document.getElementById("manageView").style.display = "block" 
        showLoggedInNavigation()
        const url = "/api/default/css"
        makeRequest('GET', url, (err, xhrResponse) => {
            if (err) { console.log(err) }
            const defaultCssObject = JSON.parse(xhrResponse)
            for (let el in defaultCssObject) {
                const labelElement = document.createElement('label')
                labelElement.innerText = el + ": "
                const inputValue = document.createElement('textarea')
                inputValue.value = JSON.stringify(defaultCssObject[el])
                inputValue.setAttribute("id", ("key_" + el.replace(" ","_")))
                //console.log(el)
                const elDiv = document.createElement('div')
                elDiv.appendChild(labelElement)
                elDiv.appendChild(inputValue)
                document.getElementById("edit-css-form").appendChild(elDiv)
            }
            document.getElementById("edit-css-save").addEventListener("click", (event) => {
                event.preventDefault()
                console.log("click")
            })
        })
    }
    else {
        window.location.href = "/auth"
    }
} 
else {
    // show front page
    document.getElementById("homeView").style.display = "block"
    // showHtmlContentTitlesList("publishedHtmlContentUrls1")    
    showHtmlContentList(true, "publishedHtmlContentUrls1")
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
    hljs.highlightAll() // call highlight js only after everything has loaded
})

