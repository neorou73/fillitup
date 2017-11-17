from bottle import route, run, template

@route('/')
def index():
    return "<h1>Fill It Up</h1>"

@route('/process/<data>')
def process(data):
    return template('you provided: {{data}}', data=data)

# run(host='localhost', port=8080)
run(host='0.0.0.0', port=8080, server='gunicorn', workers=4, debug=True)
