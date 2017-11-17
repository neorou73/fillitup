from bottle import route, run, template, get, post, request

@route('/')
def index():
    return "<h1>Fill It Up</h1><p><a href='/new'>record a new document</a></p>"

@route('/process/<data>')
def process(data):
    return template('you provided: {{data}}', data=data)

@route('/new')
def newDocumentForm():
    return """
        <form action='new' method='post'>
            <label>content:</label>
            <textarea rows=5 cols=15 name='document'></textarea>
            <input value='submit' type='submit'/>
        </form>
    """

@route('/new', method='post')
def newDocumentPost():
    documentData = request.forms.get('document')
    return documentData

# run(host='localhost', port=8080)
run(host='0.0.0.0', port=8080, server='gunicorn', workers=4, debug=True)
