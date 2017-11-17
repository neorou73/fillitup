from bottle import route, run

@route('/')
def index():
    return "<h1>Fill It Up</h1>"

# run(host='localhost', port=8080)
run(host='localhost', port=8080, debug=True)
