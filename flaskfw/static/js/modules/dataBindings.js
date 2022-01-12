const evaluateString = (theString) => {
    //console.log(theString)
    const regex = /\{\{ [a-zA-Z0-9\.]+ \}\}/g
    const matches = theString.match(regex)
    if (matches) {
        let stringObjectVariables = []
        matches.forEach(element => {
            stringObjectVariables.push(element.replace("{{ ","").replace(" }}", ""))
        })
        return stringObjectVariables
    }
    else {
        return matches
    }
}

const buildHtmlTable = (columnTitles, rowData, provideLink) => {
    let htmlString = '<table><thead><tr>'
    for (let ct=0;ct<columnTitles.length;ct++) {
        htmlString = htmlString + '<th>' + columnTitles[ct] + '</th>'
    }
    htmlString += '</tr></thead><tbody>'
    for (let r=0;r<rowData.length;r++) {
        let row = '<tr>'
        let titleString = ""
        for (let c=0;c<columnTitles.length;c++) {   
            if (columnTitles[c] == 'title') {
                titleString = rowData[r][columnTitles[c]]
            }
            if (columnTitles[c] == 'meta') {
                row = row + '<td>' + JSON.stringify(rowData[r][columnTitles[c]]) + '</td>'
            } else {
                row = row + '<td>' + rowData[r][columnTitles[c]] + '</td>'
            }
        }
        if (provideLink) {
            row = row + '<td><a href="/read/' + titleString + '">open</a></td>'
            row = row + '<td><a href="/editor/' + titleString + '">edit</a></td>'
        }

        row = row + '</tr>'
        htmlString = htmlString + row
    }
    htmlString = htmlString + '</tbody></table>'
    return htmlString
}

const valuateVjsFors = () => {
    const vjsObjects = JSON.parse(sessionStorage.getItem('vjsObjects'))
    const allusers = sessionStorage.getItem('allusers')
    //console.log(vjsObjects.fors)
}

const translateMdInput = (mdString) => {
    const MD = window.markdownit()
    console.log(MD.render(mdString))
    return MD.render(mdString)
}

//let vjsObjects = { "ifs": [], "fors": [], "models": [], "identifiers": [] }
const buildObjectBindings = (vjsObjects) => {
    
    const vjsIfs = document.querySelectorAll("[vjs-if]")   
    vjsIfs.forEach((ele) => {
        vjsObjects["identifiers"].push(ele.getAttribute("vjs-if"))
        if (evaluateString(ele.innerHTML)) {
            const esei = evaluateString(ele.innerHTML)
            //console.log(esei)
        }
        const ifsData = { "classes": ele.classList, "id": ele.id, "vjsIf": ele.getAttribute("vjs-if"), "data": ele.innerHTML }
        vjsObjects["ifs"].push(ifsData)
    })

    const vjsFors = document.querySelectorAll("[vjs-for]")
    vjsFors.forEach((ele) => {
        vjsObjects["identifiers"].push(ele.getAttribute("vjs-for"))
        if (evaluateString(ele.innerHTML)) {
            const esei = evaluateString(ele.innerHTML)
            //console.log(esei)
        }
        const forsData = { "classes": ele.classList, "id": ele.id, "vjsFor": ele.getAttribute("vjs-for"), "data": ele.innerHTML }
        vjsObjects["fors"].push(forsData)      
    })

    const vjsModels = document.querySelectorAll("[vjs-model]")
    vjsModels.forEach((ele) => {
        vjsObjects["identifiers"].push(ele.getAttribute("vjs-model"))
        if (evaluateString(ele.innerHTML)) {
            const esei = evaluateString(ele.innerHTML)
            //console.log(esei)
        }
        const modelsData = { "classes": ele.classList, "id": ele.id, "vjsModel": ele.getAttribute("vjs-model"), "data": ele.innerHTML }
        vjsObjects["models"].push(modelsData)      
    })

    sessionStorage.setItem('vjsObjects', JSON.stringify(vjsObjects))
    //console.log(vjsObjects)
    valuateVjsFors()
}

export { evaluateString, valuateVjsFors, translateMdInput, buildObjectBindings, buildHtmlTable }