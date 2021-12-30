import flask
import wrapper
import json
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room, leave_room

app = flask.Flask(__name__)
app.config["DEBUG"] = True
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
socketio = SocketIO(app,async_mode='eventlet')

wrapper = wrapper.Wrapper()

def generic_argument_call(function, json_data):
    try:
        r = function(json_data)
        return {'Status': 200, 'Json': r}
    except wrapper.WrongArguments as e:
        print("Error " + e.message)
        return {'Status': 400}
    except wrapper.NotExists as e:
        print("Error " + e.message)
        return {'Status': 404}
    except Exception as e:
        print("Undefined error.")
        return {'Status': 500}

def generic_call(function):
    try:
        r = function()
        return {'Status': 200, 'Json': r}
    except wrapper.WrongArguments as e:
        print("Error " + e.message)
        return {'Status': 400}
    except wrapper.NotExists as e:
        print("Error " + e.message)
        return {'Status': 404}
    except Exception as e:
        print("Undefined error.")
        return {'Status': 500}

@socketio.on('connect')
def on_connect(auth):
    print("New connection with auth: ", auth)

@socketio.on('disconnect')
def ont_disconnect():
    print("Client disconnected")

@socketio.on('join')
def on_join(json_data):
    join_room(json_data['Room'])
    result = generic_argument_call(wrapper.get_all_data,json_data)
    if(result['Status'] == 200):
        emit('join', result['Json'])
        return 200

@socketio.on('leave')
def on_leave(json_data):
    leave_room(json_data['room'])

@socketio.on('live_games')
def on_live_games():
    result = generic_call(wrapper.get_game_list)
    if(result['Status'] == 200):
        emit('live_games', result['Json'])

@socketio.on('create')
def on_create(json_data):
    generic_argument_call(wrapper.new_room, json_data)
    on_join({'Room': json_data['Name']})

@socketio.on("delete")
def on_delete(json_data):
    pass
    #generic_argument_call(wrapper.delete_room, json_data)


@socketio.on('send_message')
def message_send(json_data):
    result = generic_argument_call(wrapper.chat_message_send, json_data)
    if result['Status'] == 200:
        emit('new_message', result['Json'], to=json_data['Room'])


@socketio.on('exec_command')
def exec_command():
    pass


@socketio.on('exec_macro')
def exec_macro():
    pass


@socketio.on('object_new')
def object_create(json_data):
    result = generic_argument_call(wrapper.bm_object_create, json_data)
    if result['Status'] == 200:
        emit('object_new', result['Json'], to=json_data['Room'])


@socketio.on('object_delete')
def object_delete(json_data):
    result = generic_argument_call(wrapper.bm_object_delete, json_data)
    if result['Status'] == 200:
        emit('object_delete', result['Json'], to=json_data['Room'])


@socketio.on('object_move')
def object_update_position(json_data):
    result = generic_argument_call(wrapper.bm_object_update_position, json_data)
    if result['Status'] == 200:
        emit('object_move', result['Json'], to=json_data['Room'])

@socketio.on('object_transform')
def object_update_transformation(json_data):
    result = generic_argument_call(wrapper.bm_object_update_transformation, json_data)
    if result['Status'] == 200:
        emit('object_transform', result['Json'], to=json_data['Room'])

@socketio.on('token_new')
def token_create(json_data):
    result = generic_argument_call(wrapper.bm_token_create, json_data)
    if result['Status'] == 200:
        emit('token_new', result['Json'], to=json_data['Room'])

@socketio.on('token_delete')
def token_delete(json_data):
    result = generic_argument_call(wrapper.bm_token_delete, json_data)
    if result['Status'] == 200:
        emit('token_delete', json_data, to=json_data['Room'])


if __name__ == '__main__':
    socketio.run(app)