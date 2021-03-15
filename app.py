"""
Server side of the app
"""
import os
from flask import Flask, send_from_directory, json
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv
import sqlalchemy

load_dotenv(find_dotenv()) #This is to load your env variables from .env
APP = Flask(__name__, static_folder='./build/static')

# Point SQLAlchemy to your Heroku database
APP.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
# Gets rid of a warning
APP.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

DB = SQLAlchemy(APP)
# IMPORTANT: This must be AFTER creating db variable to prevent
# circular import issues
import models # pylint: disable=C0413
DB.create_all()

CORS = CORS(APP, resources={r"/*": {"origins": "*"}})
NAMES = []
SOCKETIO = SocketIO(
    APP,
    cors_allowed_origins="*",
    json=json,
    manage_session=False
)

@APP.route('/', defaults={"filename": "index.html"})
@APP.route('/<path:filename>')
def index(filename):
    """Send a given data file to qutebrowser.
    If a directory is requested, its index.html is sent.
    """
    return send_from_directory('./build', filename)

# When a client connects from this Socket connection, this function is run
@SOCKETIO.on('connect')
def on_connect():
    """ Connects with client"""
    print('User connected!')

@SOCKETIO.on('ticTac')
def tic_tac(data):
    """ data is whatever arg you pass in your emit call on client
    This emits the 'ticTac' event from the server to all clients except for
    the client that emmitted the event that triggered this function"""
    SOCKETIO.emit('ticTac', data, broadcast=True, include_self=False)

@SOCKETIO.on('user')
def user(data):
    """ data is whatever arg you pass in your emit call on client"""
    NAMES.append(data['name'])
    # This emits the 'user' event from the server to all clients except for
    # the client that emmitted the event that triggered this function
    SOCKETIO.emit('user', NAMES, broadcast=True, include_self=True)
    score_board = []
    score = []
    exists = DB.session.query(models.Person.username).filter_by(username=data['name']).first()# pylint: disable=E1101
    if not exists:
        local=data['name']
        temp=adding_new_user(local)

    query_object = DB.session.query(models.Person)# pylint: disable=E1101
    descending_order = sqlalchemy.sql.expression.desc(models.Person.score)
    query_by_order = query_object.order_by(descending_order)

    for person in query_by_order:
        score_board.append(person.username)
        score.append(person.score)

    SOCKETIO.emit('score_board', {'users': score_board})
    SOCKETIO.emit('score', {'score': score})

def adding_new_user(USERNAME):
    temp_users = []
    new_user = models.Person(username=USERNAME, score=100)
    DB.session.add(new_user)# pylint: disable=E1101
    DB.session.commit()# pylint: disable=E1101
    all_people=models.Person.query.all()
    for person in all_people:
        temp_users.append(person.username)
    return temp_users

@SOCKETIO.on('results')
def results(data):
    """ Adds +1 to winner score and -1 to losers score and arranges it in descending order"""
    score_board = []
    score = []
    outcome1 = DB.session.query(models.Person).filter_by(username=data['win']).first()# pylint: disable=E1101
    outcome1.score = outcome1.score + 1
    print(outcome1.score)
    outcome2 = DB.session.query(models.Person).filter_by(username=data['lose']).first()# pylint: disable=E1101
    outcome2.score = outcome2.score - 1
    print(outcome2.score)
    DB.session.commit()# pylint: disable=E1101

    query_object = DB.session.query(models.Person)# pylint: disable=E1101
    descending_order = sqlalchemy.sql.expression.desc(models.Person.score)
    query_by_order = query_object.order_by(descending_order)

    for person in query_by_order:
        score_board.append(person.username)
        score.append(person.score)

    SOCKETIO.emit('score_board', {'users': score_board})
    SOCKETIO.emit('score', {'score': score})

@SOCKETIO.on('remove_user')
def remove_user(data):
    """data is whatever arg you pass in your emit call on client"""
    NAMES.remove(data)
    print(NAMES)
    # This emits the 'remove_user' event from the server to all clients except for
    # the client that emmitted the event that triggered this function
    SOCKETIO.emit('remove_user', NAMES, broadcast=True, include_self=True)

# When a client disconnects from this Socket connection, this function is run
@SOCKETIO.on('disconnect')
def on_disconnect():
    """ When a user disconnets prints the following message"""
    print('User disconnected!')
# Note that we don't call app.run anymore. We call socketio.run with app arg
if __name__ == "__main__":
# Note that we don't call app.run anymore. We call socketio.run with app arg
    SOCKETIO.run(
        APP,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),# pylint: disable=W1508
    )