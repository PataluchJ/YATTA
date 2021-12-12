import flask
import wrapper
import json
from flask_cors import CORS, cross_origin

app = flask.Flask(__name__)
app.config["DEBUG"] = True
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
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

@app.route('/chat/getall', methods=['GET'])
def messages_get_all():
    result = generic_call(wrapper.chat_messages_all)
    print("GET all messages " + " result code = " + str(result['Status']))
    if result['Status'] == 200:
        return result['Response']
    else:
        flask.abort(result['Status'])


@app.route('/chat/get_by_id', methods=['POST'])
def message_get_by_id():
    json_data = json.loads(flask.request.data)
    result = generic_argument_call(wrapper.chat_message_by_id, json_data)
    print("GET message by id with " + str(json_data) + " result code = " + str(result['Status']))
    if result['Status'] == 200:
        return result['Response']
    else:
        flask.abort(result['Status'])



@app.route('/chat/get_since', methods=['POST'])
def messages_since():
    json_data = json.loads(flask.request.data)
    result = generic_argument_call(wrapper.chat_messages_since, json_data)
    print("GET messages since with " + str(json_data) + " result code = " + str(result['Status']))
    if result['Status'] == 200:
        return result['Response']
    else:
        flask.abort(result['Status'])


@app.route('/chat/send_message', methods=['POST'])
def message_send():
    json_data = json.loads(flask.request.data)
    result = generic_argument_call(wrapper.chat_message_send, json_data)
    print("GET send message with " + str(json_data) + " result code = " + str(result['Status']))
    if result['Status'] == 200:
        return result['Response']
    else:
        flask.abort(result['Status'])


@app.route('/chat/exec_command', methods=['POST'])
def exec_command():
    flask.abort(500)


@app.route('/chat/exec_macro', methods=['POST'])
def exec_macro():
    flask.abort(500)


@app.route('/bm/objects/getbyid', methods=['GET'])
def object_get_by_id():
    json_data = json.loads(flask.request.data)
    result = generic_argument_call(wrapper.bm_object_by_id, json_data)
    print("GET object by id " + str(json_data) + " result code = " + str(result['Status']))
    if result['Status'] == 200:
        return result['Response']
    else:
        flask.abort(result['Status'])


@app.route('/bm/objects/create', methods=['POST'])
def object_create():
    json_data = json.loads(flask.request.data)
    result = generic_argument_call(wrapper.bm_object_create, json_data)
    print("POST create object " + str(json_data) + " result code = " + str(result['Status']))
    if result['Status'] == 200:
        return result['Response']
    else:
        flask.abort(result['Status'])


@app.route('/bm/objects/delete', methods=['DELETE'])
def object_delete():
    json_data = json.loads(flask.request.data)
    result = generic_argument_call(wrapper.bm_object_delete, json_data)
    print("DELETE delete object " + str(json_data) + " result code = " + str(result['Status']))
    if result['Status'] == 200:
        return result['Response']
    else:
        flask.abort(result['Status'])


@app.route('/bm/objects/update_position', methods=['POST'])
def object_update_position():
    json_data = json.loads(flask.request.data)
    result = generic_argument_call(wrapper.bm_object_update_position, json_data)
    print("POST update object position" + str(json_data) + " result code = " + str(result['Status']))
    if result['Status'] == 200:
        return result['Response']
    else:
        flask.abort(result['Status'])


@app.route('/bm/objects/update_transformation', methods=['POST'])
def object_update_transformation():
    json_data = json.loads(flask.request.data)
    result = generic_argument_call(wrapper.bm_object_update_transformation, json_data)
    print("POST update object transformation" + str(json_data) + " result code = " + str(result['Status']))
    if result['Status'] == 200:
        return result['Response']
    else:
        flask.abort(result['Status'])


@app.route('/bm/tokens/getbyid', methods=['GET'])
def token_get_by_id():
    json_data = json.loads(flask.request.data)
    result = generic_argument_call(wrapper.bm_token_by_id, json_data)
    print("GET token by id " + str(json_data) + " result code = " + str(result['Status']))
    if result['Status'] == 200:
        return result['Response']
    else:
        flask.abort(result['Status'])


@app.route('/bm/tokens/create', methods=['POST'])
def token_create():
    json_data = json.loads(flask.request.data)
    result = generic_argument_call(wrapper.bm_token_create, json_data)
    print("POST create token " + str(json_data) + " result code = " + str(result['Status']))
    if result['Status'] == 200:
        return result['Response']
    else:
        flask.abort(result['Status'])


@app.route('/bm/tokens/delete', methods=['DELETE'])
def token_delete():
    json_data = json.loads(flask.request.data)
    result = generic_argument_call(wrapper.bm_token_delete, json_data)
    print("DELETE delete token " + str(json_data) + " result code = " + str(result['Status']))
    if result['Status'] == 200:
        return result['Response']
    else:
        flask.abort(result['Status'])


@app.route('/update/lastid', methods=['GET'])
def update_get_last_id():
    result = generic_call(wrapper.update_last_id)
    print("GET last update " + " result code = " + str(result['Status']))
    if result['Status'] == 200:
        return result['Response']
    else:
        flask.abort(result['Status'])


@app.route('/update/get_since', methods=['GET'])
def update_get_since():
    json_data = json.loads(flask.request.data)
    result = generic_argument_call(wrapper.update_get_since, json_data)
    print("GET update since " + str(json_data) + " result code = " + str(result['Status']))
    if result['Status'] == 200:
        return result['Response']
    else:
        flask.abort(result['Status'])


@app.route('/update/get_all_data', methods=['GET'])
def update_get_all():
    result = generic_call(wrapper.update_get_all_data)
    print("GET all updates " + " result code = " + str(result['Status']))
    if result['Status'] == 200:
        return result['Response']
    else:
        flask.abort(result['Status'])


if __name__ == '__main__':
    app.run()
