from bottle import route, run, template, get, post, request, response, redirect, BaseRequest
import json, uuid

# get configuration JSON
from os.path import dirname, abspath
webappDirectory = dirname(abspath(__file__))
configFile = webappDirectory + '/config.default.json'

with open(configFile, 'r') as jd:
    configuration = json.load(jd)

clientDirectory = webappDirectory + '/' + configuration['client-directory']
htmlTemplatesDirectory = webappDirectory + '/' + configuration['html-templates-directory']
appName = configuration['application-name']
secretKey = configuration['secret-key']

# test configuration with as follows
# print(webappDirectory)

# set memory
BaseRequest.MEMFILE_MAX = 1024 * 1024

# include the fillupDocument object
import fillupDocument
fud = fillupDocument.fillupDocument() # instantiate this here for sharing among routes below

import fillupUser
fuu = fillupUser.fillupUser()

def readFileFromTemplate(filePath):
    with open(filePath, 'r') as fd:
        return fd.read() # return as string data

# print (readFileFromTemplate(htmlTemplatesDirectory + '/login.html')) # test print

@route('/login', method='get')
def loginForm():
    """
    htmlString = '<form action="/login" method="post"><table><tbody>'
    htmlString = htmlString + '<tr><th>email:</th>'
    htmlString = htmlString + '<td><input name="email"/></td></tr>'
    htmlString = htmlString + '<tr><th>password:</th>'
    htmlString = htmlString + '<td><input type="password" name="password"/></td></tr>'
    htmlString = htmlString + '<tr><td><input type="submit" name="submit" value="login"/></tr>'
    htmlString = htmlString + '</tbody></table></form>'"""
    loginFormFile = configuration['html-templates-directory'] + '/login.html'
    htmlString = readFileFromTemplate(loginFormFile)
    return htmlString

@route('/login', method='post')
def loginUser():
    credentials = {}
    credentials['email'] = request.forms.get('email')
    credentials['password'] = request.forms.get('password')
    loggedin = fuu.loginUser(credentials['email'], credentials['password'])
    if loggedin == "Unable to find users in records.":
        return '<p>Credentials Invalid!</p><a href="/login">try logging in again</a>'
    else:
        response.set_cookie("account", credentials['email'], secret=secretKey)
        # return template('<p>generated an access token: {{loggedin}}', loggedin=loggedin)
        redirect('/')


@route('/logout', method='get')
def logoutUser():
    email = request.get_cookie("account", secret=secretKey)
    if email:
        response.set_cookie("account", '', secret=secretKey)
        loggedout = fuu.logoutUser(email)
    redirect('/login')


@route('/')
def index():
    email = request.get_cookie("account", secret=secretKey)
    allDocuments = fud.getAllDocuments()
    #print(allDocuments)
    htmlString = "<h1>Fill It Up</h1><p><a href='/new'>record a new document</a></p>"
    if email:
        htmlString = htmlString + "<p>current user: " + email + " - <a href='/logout'>logout</a></p>"
        if len(allDocuments) > 0:
            htmlString = htmlString + '<p>documents found in database:</p><table><tbody>'
            for d in allDocuments:
                htmlString = htmlString + '<tr>'
                htmlString = htmlString + '<td><a href="/show-document/' + d[0] + '" target="window">' + d[1] + '</a></td>'
                htmlString = htmlString + '<td><a href="/edit-document/' + d[0] + '">edit</a></td>'
                htmlString = htmlString + '<td><form action="/delete-document" method="post">'
                htmlString = htmlString + '<input name="documentId" value="' + d[0] + '" type="hidden"/>'
                htmlString = htmlString + '<input type="submit" value="delete"></form></td>'
                htmlString = htmlString + '</tr>'
            htmlString = htmlString + '</tbody></table>'
        else:
            htmlString = htmlString + '<p>no documents in the database right now.</p>'

        return htmlString
    else:
        redirect('/login')


@route('/show-document/<documentId>')
def showDocument(documentId):
    email = request.get_cookie("account", secret=secretKey)
    if email:
        theDocument = fud.readDocument(documentId)
        return theDocument[3] # returns json output
        # return template('you provided: {{data}}', data=data)
    else:
        redirect('/')


@route('/new')
def newDocumentForm():
    email = request.get_cookie("account", secret=secretKey)
    if email:
        return """
            <form action='new' method='post'>
                <p><label>document title:</label><input type='text' name='title' maxlength=50 /></p>
                <p><label>content:</label></p>
                <div><textarea rows=5 cols=15 name='document'></textarea></div>
                <p><input value='save document' type='submit'/></p>
            </form>
        """
    else:
        redirect('/login')

@route('/new', method='post')
def newDocumentPost():
    email = request.get_cookie("account", secret=secretKey)
    if email:
        # generate the new id
        documentId = uuid.uuid4()
        documentData = {}
        documentData["id"] = str(uuid.uuid4())
        print(documentData['id'])
        documentData["title"] = request.forms.get('title')
        documentData["creator"] = 1
        documentData["document"] = json.loads(request.forms.get('document'))
        result = fud.createDocument(documentData)
        print(result)
        if result:
            #return documentData
            redirect('/')
        else:
            return 'Error'
    else:
        redirect('/login')


@route('/delete-document', method='post')
def deleteDocument():
    email = request.get_cookie("account", secret=secretKey)
    if email:
        documentId = request.forms.get('documentId')
        result = fud.deleteDocument(documentId)
        # return ('<p>result: ' + result + '</p><p><a href="/">main page</a></p>')
        if result:
            redirect('/')
        else:
            return ('<p>result: ' + result + '</p><p><a href="/">main page</a></p>')
    else:
        redirect('/login')


@route('/edit-document/<documentId>', method='get')
def editDocumentForm(documentId):
    email = request.get_cookie("account", secret=secretKey)
    if email:
        data = fud.readDocument(documentId)
        print(json.dumps(data[3]))
        revisedData = [data[0], data[1], data[2], json.dumps(data[3])]
        formString = """
            <form action='/edit-document/{{revisedData[0]}}' method='post'>
                <p><label>document title:</label><input type='text' name='title' value='{{revisedData[1]}}' maxlength=50 /></p>
                <p><label>content:</label></p>
                <div><textarea rows=5 cols=15 name='document'>{{revisedData[3]}}</textarea></div>
                <p>
                    <input type='hidden' name='creator' value='{{revisedData[2]}}'/>
                    <input value='save edit' type='submit'/>
                </p>
            </form>
        """
        return template(formString, revisedData=revisedData)
    else:
        redirect('/login')



@route('/edit-document/<documentId>', method='post')
def editDocument(documentId):
    email = request.get_cookie("account", secret=secretKey)
    if email:
        newDocumentData = {}
        newDocumentData['title'] = request.forms.get('title')
        newDocumentData['creator'] = request.forms.get('creator')
        newDocumentData['document'] = request.forms.get('document')
        result = fud.updateDocument(documentId, newDocumentData)
        print(result)
        if result:
            redirect('/')
        else:
            return ('<p>result: ' + result + '</p><p><a href="/">main page</a></p>')
    else:
        redirect('/login')

# run the application
run(host='0.0.0.0', port=8080)
# run(host='0.0.0.0', port=8080, server='gunicorn', workers=4, debug=True)
# run(host='0.0.0.0', port=8080, server='tornado', workers=2, debug=True)
