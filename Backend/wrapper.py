import json 
import dbcontroller
import commandParser

class Wrapper:

    class Error(Exception):
        pass

    class NotExists(Error):
        def __init__(self, message):
            self.message = message

    class Failure(Error):
        def __init__(self, message):
            self.message = message

    class WrongArguments(Error):
        def __init__(self, message):
            self.message = message

    def __init__(self) -> None:
        self.dbc = dbcontroller.Controller()
        self.parser = commandParser.CommandParser()

    # Utility functiion 

    def validate_json(self, json, key_list, key_types):
        if json is None:
            raise self.WrongArguments("Not a valid json")
        for i in range(0, len(key_list)):
            if key_list[i] not in json:
                raise self.WrongArguments("Missing key " + key_list[i])
            if not isinstance(json[key_list[i]], key_types[i]):
                raise self.WrongArguments(str(key_list[i]) + " is has wrong type")

    # Update ##########

    def get_all_data(self) -> str:
        return self.dbc.get_all_data()

    # Chat ############

    def chat_messages_all(self) -> str:
        return self.dbc.get_all_messages()

    def chat_messages_since(self, data) -> str:
        self.validate_json(data, ['Id'], [int])
        return self.dbc.get_messages_since(data['Id'] + 1)

    def chat_message_by_id(self, data) -> str:
        self.validate_json(data, ['Id'], [int])
        r = self.dbc.get_message_by_id(data['Id'])
        if r is None:
            raise self.NotExists("Message not exist")
        return {'Messages': [r]}
            
    def chat_message_send(self, data) -> str:
        self.validate_json(data, ['User', 'Character', 'Text'], [str,str,str])
        self.dbc.add_message(data['User'], data['Character'], data['Text'], False)
        return {}
        

    def chat_command_exec(command: str) -> str:
        return {'Success': False, 'Message': "Not implementet"}

    def chat_macro_exec(id: int) -> str:
        return {'Success': False, 'Message': "Not implementet"}

    # Objects #########

    def bm_object_by_id(self, data) -> str:
        self.validate_json(data, ['Id'], [int])
        r = self.dbc.get_object_by_id(data['Id'])
        if r is None:
            raise self.NotExists("Object not exists")
        return r

    def bm_object_create(self, data) -> str:
        self.validate_json(data, ['Image_Id','Position'], [int, dict])
        self.validate_json(data['Position'], ['Level', 'Layer', 'Coords'], [int,int,dict])
        self.validate_json(data['Position']['Coords'], ['x','y','z_layer'], [float, float, int])
        return self.dbc.add_object(data['Image_Id'], data['Position'])
        
    def bm_object_delete(self, data) -> str:
        self.validate_json(data, ['Id'], [int])
        r = self.dbc.delete_object(data['Id'])
        if r is None:
            raise self.NotExists("Object not exists.")
        else:
            return {'Update_Id' : r}

    def bm_object_update_position(self, data) -> str:
        self.validate_json(data, ['Id', 'Position'], [int, dict])
        self.validate_json(data['Position'], ['Level', 'Layer', 'Coords'], [int,int,dict])
        self.validate_json(data['Position']['Coords'], ['x','y','z_layer'],[float, float,int])

        r = self.dbc.update_object_position(id, data['Position'])
        if r in None:
            raise self.NotExists("Object not exists.")
        return {'Update_Id': r}

    def bm_object_update_transformation(self, data) -> str:
        self.validate_json(data, ['Id', 'Transformation'], [int, dict])
        self.validate_json(data['Transformation'], ['scale_x', 'scale_y', 'rotation'], [float,float,float])
        r = self.dbc.update_object_transformation(data['Id'], data['Transformation'])
        if r in None:
            raise self.NotExists("Object not exists.")
        return {'Update_Id': r}

    # Tokens ##########

    def bm_token_by_id(self, data) -> str:
        self.validate_json(data, ['Id'], [int])
        r = self.dbc.get_token_by_id(data['Id'])
        if r is None: 
            raise self.NotExists("Token not exists.")
        return r

    def bm_token_create(self, data) -> str:
        self.validate_json(data, ['Id'], [int])
        r = self.dbc.add_token(id, [], [])
        return r

    def bm_token_delete(self, data) -> str:
        self.validate_json(data, ['Token_Id'], [int])
        r = self.dbc.delete_token(data['Token_Id'])
        if r is None:
            raise self.NotExists("Token not exists.")
        if 'Object_Id' in data:
            self.validate_json(data, ['Object_Id'], [int])
            return self.bm_object_delete(data['Object_Id'])
        return r
