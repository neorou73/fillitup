from bottle import route, run, template, get, post, request, redirect
import json, uuid

# include the fillupDocument object
import fillupDocument
fud = fillupDocument.fillupDocument() # instantiate this here for sharing among routes below

@route('/')
def index():
    allDocuments = fud.getAllDocuments()
    #print(allDocuments)
    htmlString = "<h1>Fill It Up</h1><p><a href='/new'>record a new document</a></p>"

    if len(allDocuments) > 0:
        htmlString = htmlString + '<p>documents found in database:</p><ul>'
        for d in allDocuments:
            htmlString = htmlString + '<li><a href="/show-document/' + d[0] + '" target="window">' + d[1] + '</a>'
            htmlString = htmlString + ' - <form action="/delete-document" method="post">'
            htmlString = htmlString + '<input name="documentId" value="' + d[0] + '" type="hidden"/>'
            htmlString = htmlString + '<input type="submit" value="delete"></form></li>'
        htmlString = htmlString + '</ul>'
    else:
        htmlString = htmlString + '<p>no documents in the database right now.</p>'

    return htmlString

@route('/show-document/<documentId>')
def showDocument(documentId):
    theDocument = fud.readDocument(documentId)
    return theDocument[3] # returns json output
    # return template('you provided: {{data}}', data=data)

@route('/new')
def newDocumentForm():
    return """
        <form action='new' method='post'>
            <p><label>document title:</label><input type='text' name='title' maxlength=50 /></p>
            <p><label>content:</label></p>
            <div><textarea rows=5 cols=15 name='document'></textarea></div>
            <p><input value='save document' type='submit'/></p>
        </form>
    """

@route('/new', method='post')
def newDocumentPost():
    # generate the new id
    documentId = uuid.uuid4()
    documentData = {}
    documentData["id"] = str(uuid.uuid4())
    print(documentData['id'])
    documentData["title"] = request.forms.get('title')
    documentData["creator"] = 1
    documentData["document"] = json.loads(request.forms.get('document'))
    result = fud.createDocument(documentData)
    if result:
        #return documentData
        redirect('/')
    else:
        return 'Error'

@route('/delete-document', method='post')
def deleteDocument():
    documentId = request.forms.get('documentId')
    result = fud.deleteDocument(documentId)
    # return ('<p>result: ' + result + '</p><p><a href="/">main page</a></p>')
    if result:
        redirect('/')
    else:
        return ('<p>result: ' + result + '</p><p><a href="/">main page</a></p>')


# run(host='localhost', port=8080)
run(host='0.0.0.0', port=8080, server='gunicorn', workers=4, debug=True)
