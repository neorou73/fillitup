let xhrGet = (urlString) => {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', urlString, true);
    return xhr
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
    let xhr = xhrGet('/api/users/list')
    xhr.onload = () => {
        if (xhr.readyState == 4) {
            //console.log(xhr.response)
            let allusers = []
            const response = JSON.parse(xhr.response)
            for (let u=0;u<response.length;u++) {
                allusers.push({ 'id': response[u][0], 'email': response[u][1], 'username': response[u][2], 'created': response[u][3]})
            }
            sessionStorage.setItem('allusers', JSON.stringify(allusers))
            console.log(sessionStorage)
        }
    }
    xhr.send()
}

export { test, getUsers };