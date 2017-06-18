from bottle import route, run, template
import json

def readConfig():
    with open('config.default.json', 'r') as cf:
        return json.load(cf)

configuration = readConfig()

@route('/hello/<name>')
def index(name):
    return template('<b>Hello {{name}}</b>!', name=name)

run(host='0.0.0.0', port=8080)
