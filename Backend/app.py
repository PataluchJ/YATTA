import flask
from flask import Flask
import wrapper

app = Flask(__name__)
app.config["DEBUG"] = True
wrapper = wrapper.Wrapper()


@app.route('/chat/getall', methods=['GET'])
def messages_get_all():
    r = wrapper.chat_messages_all()
    return r


@app.route('/chat/get_by_id', methods=['GET'])
def message_get_by_id():
    json_data = flask.request.json
    try:
        r = wrapper.chat_message_by_id(json_data)
        return r
    except wrapper.WrongArguments:
        return "Error: Wrong arguments provided"


@app.route('/chat/get_since', methods=['GET'])
def messages_since():
    json_data = flask.request.json
    try:
        r = wrapper.chat_messages_since(json_data)
        return r
    except wrapper.WrongArguments:
        return "Error: Wrong arguments provided"


@app.route('/chat/send_message', methods=['POST'])
def message_send():
    json_data = flask.request.json
    try:
        r = wrapper.chat_message_send(json_data)
        return r
    except wrapper.WrongArguments:
        return "Error: Wrong arguments provided"


@app.route('/chat/exec_command', methods=['POST'])
def exec_command():
    r = wrapper.chat_command_exec()
    return r


@app.route('/chat/exec_macro', methods=['POST'])
def exec_macro():
    r = wrapper.chat_macro_exec()
    return r


@app.route('bm/objects/getbyid', methods=['GET'])
def object_get_by_id():
    json_data = flask.request.json
    try:
        r = wrapper.bm_object_by_id(json_data)
        return r
    except wrapper.WrongArguments:
        return "Error 404: Object not found"


@app.route('bm/objects/create', methods=['POST'])
def object_create():
    json_data = flask.request.json
    try:
        r = wrapper.bm_object_create(json_data)
        return r
    except wrapper.WrongArguments:
        return "Error: Wrong arguments provided"


@app.route('bm/objects/delete', methods=['DELETE'])
def object_delete():
    json_data = flask.request.json
    try:
        r = wrapper.bm_object_delete(json_data)
        return r
    except wrapper.WrongArguments:
        return "Error: Wrong arguments provided"
    except wrapper.NotExists:
        return "Error 404: Object not found"


@app.route('bm/objects/update_position', methods=['POST'])
def object_update_position():
    json_data = flask.request.json
    try:
        r = wrapper.bm_object_update_position(json_data)
        return r
    except wrapper.WrongArguments:
        return "Error: Wrong arguments provided"
    except wrapper.NotExists:
        return "Error 404: Object not found"


@app.route('bm_object_update_transformation', methods=['POST'])
def object_update_transformation():
    json_data = flask.request.json
    try:
        r = wrapper.bm_object_update_transformation(json_data)
        return r
    except wrapper.WrongArguments:
        return "Error: Wrong arguments provided"
    except wrapper.NotExists:
        return "Error 404: Object not found"


@app.route('bm/tokens/getbyid', methods=['GET'])
def token_get_by_id():
    json_data = flask.request.json
    try:
        r = wrapper.bm_token_by_id(json_data)
        return r
    except wrapper.WrongArguments:
        return "Error 404: Object not found"
    except wrapper.NotExists:
        return "Error 404: Object not found"


@app.route('bm/tokens/create', methods=['POST'])
def token_create():
    json_data = flask.request.json
    try:
        r = wrapper.bm_token_create(json_data)
        return r
    except wrapper.WrongArguments:
        return "Error: Wrong arguments provided"


@app.route('bm/tokens/delete', methods=['DELETE'])
def token_delete():
    json_data = flask.request.json
    try:
        r = wrapper.bm_token_delete(json_data)
        return r
    except wrapper.WrongArguments:
        return "Error: Wrong arguments provided"
    except wrapper.NotExists:
        return "Error 404: Object not found"


@app.route('/update/lastid', methods=['GET'])
def update_get_last_id():
    r = wrapper.update_last_id()
    return r


@app.route('/update/get_since', methods=['GET'])
def update_get_since():
    json_data = flask.request.json
    try:
        r = wrapper.update_get_since(json_data)
        return r
    except wrapper.WrongArguments:
        return "Error: Wrong arguments provided"


@app.route('/update/get_all_data', methods=['GET'])
def update_get_all():
    r = wrapper.update_get_all_data()
    return r


if __name__ == '__main__':
    app.run()
