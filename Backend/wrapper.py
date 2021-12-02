import json 

# Errors 

class Error(Exception):
    pass

class NotExists(Error):
    def __init__(self, message):
        self.message = message

class Failure(Error):
    def __init__(self, message):
        self.message = message

# Update ##########

def update_last_id() -> str:
    return '\{"Last_Id": -1\}'

def update_get_since(id: int) -> str:
    return '''{"Updates": []}'''

def update_get_all_data() -> str:
    return '''{"Battlemap": {
        "Name": "Test map name",
        "Levels_Names": ["Level 1"],
        "Objects": [],
        "Tokents": []
    } }'''


# Chat ############

def chat_messages_all() -> str:
    return '''
    {
        "Messages": [ { 
            "Id": 0, 
            "User": "Test user", 
            "Character": "", 
            "Text": "Message",
            "Command": false } ]
    }
    '''

def chat_messages_since(id: int) -> str:
    return '''{ "Messages": [] }'''

def chat_message_by_id(id: int) -> str:
    return '''{ "Messages": [] }'''

def chat_message_send(message: str) -> str:
    return '''{"Success": false, "Message": "Not implementet!" }'''

def chat_command_exec(command: str) -> str:
    return '''{"Success": false, "Message": "Not implementet!" }'''

def chat_macro_exec(id: int) -> str:
    return '''{"Success": false, "Message": "Not implementet!" }'''

# Objects #########

def bm_object_by_id(id: int) -> str:
    raise NotExists

def bm_object_create(image_id: int, position) -> str:
    raise Failure

def bm_object_delete(id: int) -> str:
    raise NotExists

def bm_object_update_position(id: int, new_config) -> str:
    raise NotExists

def bm_object_update_transformation(id: int, new_config) -> str:
    return NotExists

# Tokens ##########

def bm_token_by_id(id: int) -> str:
    raise NotExists

def bm_token_create(object_id: int) -> str:
    raise Failure

def bm_token_delete(id: int) -> str:
    raise NotExists

