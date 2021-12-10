if(document.readyState === "complete") {
    // Fully loaded!
    function reqListener () {
        console.log(this.responseText);
    }
      
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", "http://www.example.org/example.txt");
    oReq.send();

    /* GET request example */
    let xhrGet = () => {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/api', true);

        xhr.onload = function () {
            // Request finished. Do processing here.
            console.log(xhr.response)
        };

        xhr.send(null);
        // xhr.send('string');
        // xhr.send(new Blob());
        // xhr.send(new Int8Array());
        // xhr.send(document);
    }
    

    /* POST request example */
    let xhrPost = () => {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", '/server', true);

        //Send the proper header information along with the request
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        xhr.onreadystatechange = () => { // Call a function when the state changes.
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                // Request finished. Do processing here.
                console.log(xhr.response)
            }
        }
        xhr.send("foo=bar&lorem=ipsum"); // data as url safe text
        // xhr.send(new Int8Array());
        // xhr.send(document);
        // to send data instead of application/x-www-form-urlencoded, use application/json instead
    }

    /* formdata example */
    let formExample = () => {
        let myForm = document.getElementById('myForm');
        let formData = new FormData(myForm);
        /* formdata methods */
        /*
        FormData.append()
        Appends a new value onto an existing key inside a FormData object, or adds the key if it does not already exist.

        FormData.delete()
        Deletes a key/value pair from a FormData object.

        FormData.entries()
        Returns an iterator allowing to go through all key/value pairs contained in this object.

        FormData.get()
        Returns the first value associated with a given key from within a FormData object.

        FormData.getAll()
        Returns an array of all the values associated with a given key from within a FormData.

        FormData.has()
        Returns a boolean stating whether a FormData object contains a certain key.

        FormData.keys()
        Returns an iterator allowing to go through all keys of the key/value pairs contained in this object.

        FormData.set()
        Sets a new value for an existing key inside a FormData object, or adds the key/value if it does not already exist.

        FormData.values()
        Returns an iterator allowing to go through all values  contained in this object.
        */
    }
    
}
else if(document.readyState === "interactive") {
    // DOM ready! Images, frames, and other subresources are still downloading.
}
else {
    // Loading still in progress.
    // To wait for it to complete, add "DOMContentLoaded" or "load" listeners.

    window.addEventListener("DOMContentLoaded", () => {
        // DOM ready! Images, frames, and other subresources are still downloading.
    });

    window.addEventListener("load", () => {
        // Fully loaded!
    });
}