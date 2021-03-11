import os
from flask import Flask, send_from_directory, json, session
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv
import sqlalchemy

load_dotenv(find_dotenv()) #This is to load your env variables from .env
app = Flask(__name__, static_folder='./build/static') # pylint: disable=C0103

# Point SQLAlchemy to your Heroku database
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
# Gets rid of a warning
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
# IMPORTANT: This must be AFTER creating db variable to prevent
# circular import issues
import models # pylint: disable=C0413
db.create_all()

cors = CORS(app, resources={r"/*": {"origins": "*"}})
names = []
socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    json=json,
    manage_session=False
)

@app.route('/', defaults={"filename": "index.html"})
@app.route('/<path:filename>')
def index(filename):
    return send_from_directory('./build', filename)

# When a client connects from this Socket connection, this function is run
@socketio.on('connect')
def on_connect():
    print('User connected!')

@socketio.on('ticTac')
def ticTac(data): # data is whatever arg you pass in your emit call on client
    # This emits the 'ticTac' event from the server to all clients except for
    # the client that emmitted the event that triggered this function
    socketio.emit('ticTac', data, broadcast=True, include_self=False)

@socketio.on('user')
def user(data): # data is whatever arg you pass in your emit call on client
    names.append(data['name'])
    # This emits the 'user' event from the server to all clients except for
    # the client that emmitted the event that triggered this function
    socketio.emit('user', names, broadcast=True, include_self=True)
    score_board = []
    score = []
    exists = db.session.query(models.Person.username).filter_by(username=data['name']).first()
    if not exists:
        new_user = models.Person(username=data['name'], score=100)
        db.session.add(new_user)
        db.session.commit()

    query_object = db.session.query(models.Person)
    descending_order = sqlalchemy.sql.expression.desc(models.Person.score)
    query_by_order = query_object.order_by(descending_order)

    for person in query_by_order:
        score_board.append(person.username)
        score.append(person.score)

    socketio.emit('score_board', {'users': score_board})
    socketio.emit('score', {'score': score})

@socketio.on('results')
def results(data):
    score_board = []
    score = []
    outcome1 = db.session.query(models.Person).filter_by(username=data['win']).first()
    outcome1.score = outcome1.score + 1
    print(outcome1.score)
    outcome2 = db.session.query(models.Person).filter_by(username=data['lose']).first()
    outcome2.score = outcome2.score - 1
    print(outcome2.score)
    db.session.commit()

    query_object = db.session.query(models.Person)
    descending_order = sqlalchemy.sql.expression.desc(models.Person.score)
    query_by_order = query_object.order_by(descending_order)

    for person in query_by_order:
        score_board.append(person.username)
        score.append(person.score)

    socketio.emit('score_board', {'users': score_board})
    socketio.emit('score', {'score': score})

@socketio.on('remove_user')
def remove_user(data): # data is whatever arg you pass in your emit call on client
    names.remove(data)
    print(names)
    # This emits the 'remove_user' event from the server to all clients except for
    # the client that emmitted the event that triggered this function
    socketio.emit('remove_user', names, broadcast=True, include_self=True)

# When a client disconnects from this Socket connection, this function is run
@socketio.on('disconnect')
def on_disconnect():
    print('User disconnected!')
# Note that we don't call app.run anymore. We call socketio.run with app arg
if __name__ == "__main__":
# Note that we don't call app.run anymore. We call socketio.run with app arg
    socketio.run(
        app,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
    )
