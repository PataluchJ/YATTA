import json 
import dbcontroller

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

    def update_last_id(self) -> str:
        return self.dbc.update_last_id()

    def update_get_since(self, res_json) -> str:
        data = {}
        try:
            data = json.loads(res_json)
        except Exception as e:
            raise self.WrongArguments("Not a valid JSON.")
        if not 'Id' in data:
            raise self.WrongArguments("Missing Id argument.")
        id = data['Id']
        if not isinstance(id, int):
            try:
                id = int(id)
            except TypeError:
                raise self.WrongArguments("Id argument must be a int.")
        return self.dbc.get_updates_since(id)

    def update_get_all_data(self) -> str:
        return self.dbc.get_all_data()

    # Chat ############

    def chat_messages_all(self) -> str:
        return json.dumps(self.dbc.get_all_messages())

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
        return json.dumps({'Success': False, 'Message': "Not implementet"})

    def chat_macro_exec(id: int) -> str:
        return json.dumps({'Success': False, 'Message': "Not implementet"})

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

        if data is None:
            raise self.WrongArguments("Not a valid json")
        if not (data.keys() >= {'Id', 'Position'} \
            and data['Position'].keys() >= {'Level', 'Layer', 'Coords'}\
            and data['Position']['Coords'].keys() >= {'x', 'y', 'z_layer'}):
            raise self.WrongArguments("Missing arguments.")
        
        id = data['Id']
        if not isinstance(id, int):
            try:
                id = int(id)
            except TypeError:
                raise self.WrongArguments("Wrong argument type.")
        r = self.dbc.update_object_position(id, data['Position'])
        if r in None:
            raise self.NotExists("Object not exists.")
        return json.dumps({'Update_Id': r})

    def bm_object_update_transformation(self, res_json) -> str:
        data = {}
        try:
            data = json.loads(res_json)
        except Exception as e:
            raise self.WrongArguments("Not a valid JSON.")
        if not (data.keys() >= {'Id', 'Transformation'} \
            and data['Transformation'].keys() >= {'scale_x', 'scale_y', 'rotation'}):
            raise self.WrongArguments("Missing arguments.")
        
        id = data['Id']
        if not isinstance(id, int):
            try:
                id = int(id)
            except TypeError:
                raise self.WrongArguments("Wrong argument type.")
        r = self.dbc.update_object_transformation(id, data['Transformation'])
        if r in None:
            raise self.NotExists("Object not exists.")
        return json.dumps({'Update_Id': r})

    # Tokens ##########

    def bm_token_by_id(self, res_json) -> str:
        data = {}
        try:
            data = json.loads(res_json)
        except Exception as e:
            raise self.WrongArguments("Not a valid JSON.")
        if not data.keys() >= {'Id'}:
            raise self.WrongArguments("Missing Id argument.")
        id = data['Id']
        if not isinstance(id, int):
            try:
                id = int(id)
            except TypeError:
                raise self.WrongArguments("Wrong argument type.")
        r = self.dbc.get_token_by_id(id)
        if r is None: 
            raise self.NotExists("Token not exists.")
        return json.dumps(r)

    def bm_token_create(self, res_json) -> str:
        data = {}
        try:
            data = json.loads(res_json)
        except Exception as e:
            raise self.WrongArguments("Not a valid JSON.")
        if not data.keys() >= 'Object_Id':
            return self.WrongArguments("Missing Object_Id argument.")
        id = data['Object_Id']
        if not isinstance(id, int):
            try:
                id = int(id)
            except:
                raise self.WrongArguments("Wrong argument type.")
        r = self.dbc.add_token(id, [], [])
        return json.dumps(r)

    def bm_token_delete(self, res_json) -> str:
        data = {}
        try:
            data = json.loads(res_json)
        except Exception as e:
            raise self.WrongArguments("Not a valid JSON.")
        if not data.keys() >= 'Token_Id':
            return self.WrongArguments("Missing Token_ID argument.")
        id = data['Token_Id']
        if not isinstance(id, int):
            try:
                id = int(id)
            except:
                raise self.WrongArguments("Wrong argument type.")
        r = self.dbc.delete_token(id)
        if r is None:
            raise self.NotExists("Token not exists.")
        if 'Object_Id' in data:
            return json.dumps(self.bm_object_delete(data))
        return json.dumps(r)
