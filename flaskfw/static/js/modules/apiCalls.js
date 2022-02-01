/*
 * lists: get users, keywords, uploads, htmlContents 
 * define postings for saving htmlContent, add/remove keywords, uploading a file, add/change user
 */
const test = () => {
    return 'testing, testing....klatoo verata nikto!'
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

const translateMdInput = (mdString) => {
    const MD = window.markdownit()
    console.log(MD.render(mdString))
    return MD.render(mdString)
}

export { test, makeRequest, makePostRequest, translateMdInput };