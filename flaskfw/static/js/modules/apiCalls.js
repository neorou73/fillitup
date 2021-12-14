const xhrGet = (urlString) => {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', urlString, true);
    return xhr
}

const getXhrList = (urlString, sessionStorageKey) => {
    let xhr = xhrGet(urlString)
    xhr.onload = () => {
        if (xhr.readyState == 4) {
            sessionStorage.setItem(sessionStorageKey, JSON.stringify(JSON.parse(xhr.response)))
            // console.log(sessionStorage)
        }
    }
    xhr.send()
}

const xhrPost = (postUrl) => {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", postUrl, true);
    return xhr
}

const addUserPost = (userData) => {
    let xhr = xhrPost('/api/users/add')
    //Send the proper header information along with the request
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = () => {
        if (xhr.readyState == 4) {
            console.log(xhr.response)
            getXhrList('/api/users/list', 'allusers')
        }
    }
    console.log(userData)
    xhr.send(JSON.stringify(userData))
}

/*
 * lists: get users, keywords, uploads, htmlContents 
 * define postings for saving htmlContent, add/remove keywords, uploading a file, add/change user
 */
const test = () => {
    return 'testing, testing....klatoo verata nikto!'
}

const getUsers = () => {
    getXhrList('/api/users/list', 'allusers')
}
const getKeywords = () => {
    getXhrList('/api/keywords/list', 'allkeywords')
}
const getFileUploads = () => {
    getXhrList('/api/fileuploads/list', 'allfileuploads')
}
const getHtmlContents = () => {
    getXhrList('/api/htmlcontents/list', 'allhtmlcontents')
}

export { test, getUsers, getKeywords, getFileUploads, getHtmlContents, xhrGet, xhrPost, addUserPost };