$( document ).ready(function() {
    console.log( "document ready!" );
    const showOne = (toShow) => {
        $('.manage-section').hide()
        $(toShow).show()
    }
    showOne('#manage-users') // default call

    $(".manage-section-selector").click((e) => {
        // console.log(e.target.id)
        const divToShowId = "#" + e.target.id.replace("-selector", "") // drop the last text to give the div we want to show
        showOne(divToShowId)
    })

    // reuseable function to turn serialized data to object 

    const objectifySerial = (serialString) => {
        let returnObject = {}
        let returnArray = serialString.split("&")
        returnArray.forEach(element => {
            returnObject[(element.split("=")[0])] = element.split("=")[1]
        })
        return returnObject
    }

    // submitting forms
    $("#formUsersAdd").submit((e) => {
        e.preventDefault(); // avoid to execute the actual submit of the form.
        
        $.ajax({
            type: "POST",
            url: e.target.action,
            data: (objectifySerial($("#formUsersAdd").serialize())), // serializes the form's elements.
            success: function(response){
                console.log(response); // show response from the php script.
                $("#manage-users").find(".form-result").append('user added')
            }
        });
    })

    $("#formUsersEdit").submit((e) => {

    })

    $("#formUsersDeactivate").submit((e) => {

    })

    $("#formUsersPurge").submit((e) => {

    })

    $("#formSectionsAdd").submit((e) => {

    })

    $("#formSectionsRemove").submit((e) => {

    })

    $("#formSectionsEdit").submit((e) => {

    })

    $("#formPresentationConfigure").submit((e) => {

    })

    $("#formKeywordsAdd").submit((e) => {

    })

    $("#formKeywordsRemove").submit((e) => {

    })

});