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

    // reuseable function to submit manage forms 
    const submitManageForm = (formId, parentDivId, successMsg, errorMsg) => {
        $(formId).submit((e) => {
            e.preventDefault() // avoid to execute the actual submit of the form.
            console.log(objectifySerial($(formId).serialize()))
            $.ajax({
                type: "POST",
                url: e.target.action,
                data: (objectifySerial($(formId).serialize())), // serializes the form's elements.
                success: function(response){
                    console.log(response) // show response from the php script.
                    $(parentDivId).find(".form-result").append(successMsg)
                },
                error: function(eresponse){
                    console.log(eresponse)
                    $(parentDivId).find(".form-result").append(errorMsg)
                }
            })
        })
    }

    const getUsers = () => {
        $.ajax({
            type: "GET",
            url: '/users/list',
            success: (response) => {
                console.log(response)
                console.log(response.length)
                const usersFound = {
                    data() {
                        return {
                            users: response
                        }
                    }
                }
                  
                Vue.createApp(usersFound).mount('#usersList')
                //$('#userslist').replaceWith(htmlString)
            },
            error: (eresponse) => {
                console.log(eresponse)
            }
        })
    }
    getUsers()
    // submitting forms, specific example of the above
    /*
    $("#formUsersAdd").submit((e) => {
        e.preventDefault(); // avoid to execute the actual submit of the form.
        $.ajax({
            type: "POST",
            url: e.target.action,
            data: (objectifySerial($("#formUsersAdd").serialize())), // serializes the form's elements.
            success: function(response){
                console.log(response) // show response from the php script.
                $("#formUsersAddDiv").find(".form-result").append('user added')
            },
            error: function(eresponse){
                console.log(eresponse)
                $("#formUsersAddDiv").find(".form-result").append('ERROR: user was NOT added')
            }
        })
    })
    */
    // instead we are calling the function 
    submitManageForm("#formUsersAdd", "#formUsersAddDiv", "user added", "ERROR: user was NOT added")
    submitManageForm("#formUsersEdit", "#formUsersEditDiv", "user edited", "ERROR: user was NOT edited")
    submitManageForm("#formUsersDeactivate", "#formUsersDeactivateDiv", "user deactivated", "ERROR: user was NOT deactivated")
    submitManageForm("#formUsersPurge", "#formUsersPurgeDiv", "user purged", "ERROR: user was NOT purged")

    submitManageForm("#formSectionsAdd", "#formSectionsAddDiv", "section added", "ERROR: section was NOT added")
    submitManageForm("#formSectionsRemove", "#formSectionsRemoveDiv", "user removed", "ERROR: section was NOT removed")
    submitManageForm("#formSectionsEdit", "#formSectionsEditDiv", "user edited", "ERROR: section was NOT edited")
    
    submitManageForm("#formPresentationConfigure", "#formPresentationConfigureDiv", "configuration change made", "ERROR: configuration change was NOT made")
    
    submitManageForm("#formKeywordsAdd", "#formKeywordsAddDiv", "keyword added", "ERROR: keyword was NOT added")
    submitManageForm("#formKeywordsRemove", "#formKeywordsRemoveDiv", "keyword removed", "ERROR: keyword was NOT removed")

});