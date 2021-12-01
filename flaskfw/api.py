from flask import Flask, render_template, request, make_response, redirect, abort, session, jsonify  

app = Flask(__name__)
Flask.SECRET_KEY = b'26ae9dd5b52d5111d9376decfeb36f1506848a623941678b31d845582e84b038'

#url_for('static', filename='style.css')

@app.route("/")
@app.route('/hello/<name>')
def hello(name=None):
    return render_template('hello.html', name=name)
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
            pdb.loginUser(request.form['email'])
        else:
            print ('user is not valid')
        
    return render_template('login.html', error=error)


@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        f = request.files['the_file']
        filename = "getname"
        f.save('/uploads/' + filename)
    
    return render_template('upload.html', name=name)


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