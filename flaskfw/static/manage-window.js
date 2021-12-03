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
});