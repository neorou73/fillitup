

document.addEventListener('readystatechange', event => { 

    // When HTML/DOM elements are ready:
    if (event.target.readyState === "interactive") {   //does same as:  ..addEventListener("DOMContentLoaded"..
        //alert("hi 1");
        let messageString = 'Hello Vue!'
        console.log(messageString)
        /*var app6 = new Vue({
            el: '#app-6',
            data: {
            message: messageString
            }
        })*/
    }

    // When window loaded ( external resources are loaded too- `css`,`src`, etc...) 
    if (event.target.readyState === "complete") {
        let messageString = 'Vue is loaded!'
        console.log(messageString)
    }
});