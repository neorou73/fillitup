$( document ).ready(function() {
    console.log( "document fe_manage.js ready!" )
    const showOneMngDiv = (visibleDiv) => {
        $(".management-div").hide()
        $(visibleDiv).show()
    }
    showOneMngDiv("#mng-users") // default div to show 
    $(".select-mng-div").click((e) => {
        console.log(e.target)
        $(".select-mng-div").removeClass('keywordTagged')
        $(('#' + e.target.id)).addClass('keywordTagged')
        const eTargetId = "#mng-" + (e.target.id).replace("select-","").replace("-mng","")
        console.log(eTargetId)
        showOneMngDiv(eTargetId)
    })
})