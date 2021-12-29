import flask
import wrapper
import json
from flask_cors import CORS, cross_origin
from flask_socketio import SocketIO, send, emit

app = flask.Flask(__name__)
app.config["DEBUG"] = True
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
socketio = SocketIO(app)

wrapper = wrapper.Wrapper()

def generic_argument_call(function, json_data):
    try:
        r = function(json_data)
        response = flask.jsonify(r)
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "*")
        response.headers.add("Access-Control-Allow-Methods", "*")

        return {'Status': 200, 'Response': response}
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
        response = flask.jsonify(r)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return {'Status': 200, 'Response': response}
    except wrapper.WrongArguments as e:
        print("Error " + e.message)
        return {'Status': 400}
    except wrapper.NotExists as e:
        print("Error " + e.message)
        return {'Status': 404}
    except Exception as e:
        print("Undefined error.")
        return {'Status': 500}

@socketio.on('messages_get_all')
def messages_get_all():
    result = generic_call(wrapper.chat_messages_all)
    print("GET all messages " + " result code = " + str(result['Status']))
    if result['Status'] == 200:
        send(result['Response'])
    else:
        send({"Error": result['Status']})

@socketio.on('message_get_by_id')
def message_get_by_id(data):
    json_data = json.loads(data)
    result = generic_argument_call(wrapper.chat_message_by_id, json_data)
    print("GET message by id with " + str(json_data) + " result code = " + str(result['Status']))
    if result['Status'] == 200:
        send(result['Response'])
    else:
        send({"Error": result['Status']})



@socketio.on('messages_since')
def messages_since(data):
    json_data = json.loads(data)
    result = generic_argument_call(wrapper.chat_messages_since, json_data)
    print("GET messages since with " + str(json_data) + " result code = " + str(result['Status']))
    if result['Status'] == 200:
        send(result['Response'])
    else:
        send({"Error": result['Status']})


@socketio.on('send_message')
def message_send(data):
    json_data = json.loads(data)
    result = generic_argument_call(wrapper.chat_message_send, json_data)
    print("GET send message with " + str(json_data) + " result code = " + str(result['Status']))
    if result['Status'] == 200:
        send(result['Response'])
    else:
        send({"Error": result['Status']})


@socketio.on('exec_command')
def exec_command():
    flask.abort(500)


@socketio.on('exec_macro')
def exec_macro():
    flask.abort(500)


@socketio.on('object_get_by_id')
def object_get_by_id(data):
    json_data = json.loads(data)
    result = generic_argument_call(wrapper.bm_object_by_id, json_data)
    print("GET object by id " + str(json_data) + " result code = " + str(result['Status']))
    if result['Status'] == 200:
        send(result['Response'])
    else:
        send({"Error": result['Status']})


@socketio.on('object_new')
def object_create(data):
    json_data = json.loads(data)
    result = generic_argument_call(wrapper.bm_object_create, json_data)
    print("POST create object " + str(json_data) + " result code = " + str(result['Status']))
    if result['Status'] == 200:
        send(result['Response'])
    else:
        send({"Error": result['Status']})


@socketio.on('object_delete')
def object_delete(data):
    json_data = json.loads(data)
    result = generic_argument_call(wrapper.bm_object_delete, json_data)
    print("DELETE delete object " + str(json_data) + " result code = " + str(result['Status']))
    if result['Status'] == 200:
        send(result['Response'])
    else:
        send({"Error": result['Status']})


@socketio.on('object_move')
def object_update_position(data):
    json_data = json.loads(data)
    result = generic_argument_call(wrapper.bm_object_update_position, json_data)
    print("POST update object position" + str(json_data) + " result code = " + str(result['Status']))
    if result['Status'] == 200:
        send(result['Response'])
    else:
        send({"Error": result['Status']})


@socketio.on('object_transform')
def object_update_transformation(data):
    json_data = json.loads(data)
    result = generic_argument_call(wrapper.bm_object_update_transformation, json_data)
    print("POST update object transformation" + str(json_data) + " result code = " + str(result['Status']))
    if result['Status'] == 200:
        send(result['Response'])
    else:
        send({"Error": result['Status']})


@socketio.on('token_get_by_id')
def token_get_by_id(data):
    json_data = json.loads(data)
    result = generic_argument_call(wrapper.bm_token_by_id, json_data)
    print("GET token by id " + str(json_data) + " result code = " + str(result['Status']))
    if result['Status'] == 200:
        send(result['Response'])
    else:
        send({"Error": result['Status']})


@socketio.on('token_new')
def token_create(data):
    json_data = json.loads(data)
    result = generic_argument_call(wrapper.bm_token_create, json_data)
    print("POST create token " + str(json_data) + " result code = " + str(result['Status']))
    if result['Status'] == 200:
        send(result['Response'])
    else:
        send({"Error": result['Status']})


@socketio.on('token_delete')
def token_delete(data):
    json_data = json.loads(data)
    result = generic_argument_call(wrapper.bm_token_delete, json_data)
    print("DELETE delete token " + str(json_data) + " result code = " + str(result['Status']))
    if result['Status'] == 200:
        send(result['Response'])
    else:
        send({"Error": result['Status']})


@socketio.on('update_get_last_id')
def update_get_last_id():
    result = generic_call(wrapper.update_last_id)
    print("GET last update " + " result code = " + str(result['Status']))
    if result['Status'] == 200:
        send(result['Response'])
    else:
        send({"Error": result['Status']})


@socketio.on('update_get_since')
def update_get_since(data):
    json_data = json.loads(data)
    result = generic_argument_call(wrapper.update_get_since, json_data)
    print("GET update since " + str(json_data) + " result code = " + str(result['Status']))
    if result['Status'] == 200:
        send(result['Response'])
    else:
        send({"Error": result['Status']})


@socketio.on('update_get_all')
def update_get_all():
    result = generic_call(wrapper.update_get_all_data)
    print("GET all updates " + " result code = " + str(result['Status']))
    if result['Status'] == 200:
        send(result['Response'])
    else:
        send({"Error": result['Status']})


if __name__ == '__main__':
    app.run()
