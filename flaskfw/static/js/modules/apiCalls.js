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
            console.log(sessionStorage)
        }
    }
    xhr.send()
}



const xhrPost = (postUrl) => {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", postUrl, true);

    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // 
    return xhr
}

/*
 * lists: get users, keywords, uploads, htmlContents 
 * define postings for saving htmlContent, add/remove keywords, uploading a file, add/change user
 */
const test = () => {
    return 'klatoo verata nikto'
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

export { test, getUsers, getKeywords, getFileUploads, getHtmlContents };