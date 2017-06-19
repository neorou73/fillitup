# all the imports
import json
from flask import Flask, request, session, g, redirect, url_for, abort, render_template, flash

def readConfig():
    sourceFile = 'config.default.json'
    with open(sourceFile, 'r') as cf:
        output = json.load(cf)
        print(output)
        return output

configuration = readConfig()

# run(host=configuration['fillitup']['application-host'], port=configuration['fillitup']['application-port'], debug=True)

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'
