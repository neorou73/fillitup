from flask import Flask, render_template, request, make_response, redirect, abort, session, jsonify, url_for  

import os, json, sys  

def readConfigurationFile():
    try:
        print("attempting to read configuration...")
        jsonFilePath = os.getcwd() + "/api.config.default.json"
        f = open(jsonFilePath, 'r')
        jsonData = json.load(f)
        f.close()
        return jsonData
    except Exception as e:
        print('unable to read configuration file - please ensure file exists and properly formatted.')
        sys.exit()

configurationObject = readConfigurationFile()
print("read configuration file")
#print(configurationObject['application']['secret_key'])

app = Flask(__name__)
app.secret_key = bytes(configurationObject['application']['secret_key'], 'utf-8')

#url_for('static', filename='style.css')

fileUploadDirectoryPath = os.path.dirname(os.path.realpath(__file__)) + "/static/fileuploads"
print(fileUploadDirectoryPath)

@app.route("/")
@app.route('/hello/<name>')
def hello(name=None):
    if 'email' in session:
        return render_template('hello.html', name=session['email'], loggedin=True)
    return render_template('hello.html', name=name, loggedin=False)
    #return "<p>Hello, World!</p>"


@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    import sys
    sys.path.append(".")
    from fillupDbc import psqldb 
    pdb = psqldb()
    if request.method == 'POST':
        print(request.form['email'])
        print(request.form['password'])
        if pdb.validateUser(request.form['email'], request.form['password']):
            print ('user is valid')
            if pdb.loginUser(request.form['email']):
                session['email'] = request.form['email']
                return render_template('hello.html', name=request.form['email'])
        else:
            enotice = "user is not valid"
            print (enotice)
            error=enotice
        
    return render_template('login.html', error=error)

@app.route('/logout')
def logout():
    # remove the username from the session if it's there
    session.pop('email', None)
    return redirect(url_for('hello'))


@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    if 'email' in session:
        if request.method == 'POST':
            f = request.files['file1']
            print(f)
            print(f.content_type)
            print(f.filename)
            #filename = "getname"
            f.save(fileUploadDirectoryPath + '/' + f.filename)
        
        return render_template('upload.html')
    return redirect(url_for('hello'))

@app.route('/editor', methods=['GET', 'POST'])
@app.route('/editor/<postTitle>', methods=['GET', 'POST'])
def use_editor(postTitle=None):
    if 'email' in session:
        #if request.method == "POST" and hasattr(request.form, 'title'):
        if request.method == "POST":
            print(request.form['title'])
            print(request.form['editortextarea'])
        return render_template('editor.html', title=postTitle)
    return redirect(url_for('hello'))


@app.route('/manage')
def manage_site():
    error = None
    if 'email' in session:
        return render_template('manage.html')
    return redirect(url_for('hello'))

# bad request
@app.errorhandler(400)
def not_found(error):
    resp = make_response(render_template('error.html', code=400), 400)
    #resp.headers['X-Something'] = 'A value'
    return resp


# unauthorized
@app.errorhandler(401)
def not_found(error):
    resp = make_response(render_template('error.html', code=401), 401)
    #resp.headers['X-Something'] = 'A value'
    return resp


# forbidden
@app.errorhandler(403)
def not_found(error):
    resp = make_response(render_template('error.html', code=403), 403)
    #resp.headers['X-Something'] = 'A value'
    return resp


# not found
@app.errorhandler(404)
def not_found(error):
    resp = make_response(render_template('error.html', code=404), 404)
    #resp.headers['X-Something'] = 'A value'
    return resp


# method not allowed
@app.errorhandler(405)
def not_found(error):
    resp = make_response(render_template('error.html', code=405), 405)
    #resp.headers['X-Something'] = 'A value'
    return resp