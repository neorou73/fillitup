from bottle import route, run, template
import json

def readConfig():
    sourceFile = 'config.default.json'
    with open(sourceFile, 'r') as cf:
        output = json.load(cf)
        print(output)
        return output

configuration = readConfig()

@route('/hello/<name>')
def index(name):
    return template('<b>Hello {{name}}</b>!', name=name)

run(host=configuration['fillitup']['application-host'], port=configuration['fillitup']['application-port'], debug=True)
