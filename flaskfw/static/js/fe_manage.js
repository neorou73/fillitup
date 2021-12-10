$( document ).ready(function() {
    console.log( "document fe_manage.js ready!" )
    const showOneMngDiv = (visibleDiv) => {
        console.log('hiding')
        $(".management-div").hide()
        $(visibleDiv).show()
    }

    const readUsers = () => {
        $.ajax({
            type: "GET",
            url: '/api/users/list',
            success: function(response){
                //console.log(response) // show response from the php script
                let usersList = []
                for (let r=0;r<response.length;r++) {
                    usersList.push({ username: response[r][2], email: response[r][1], id: response[r][0], created: response[r][3] })
                }
                localStorage.setItem('fiuManageUsers', JSON.stringify(usersList))
                Vue.createApp({
                    data() {
                        return { users: usersList }
                    }
                }).mount('#userslist')
                console.log(usersList)
            },
            error: function(eresponse){
                console.log(eresponse)
            }
        })
    }
    readUsers()

    const metaTagSelectors = {
        methods: {
            showOnly(event) {
                console.log(event.target)
            }
        }
    }
    Vue.createApp(metaTagSelectors).mount('#selectManageDiv')
})