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


    # Update ##########

    def update_last_id(self) -> str:
        return self.dbc.update_last_id()

    def update_get_since(self, res_json) -> str:
        data = json.loads(res_json)
        if not 'Id' in data:
            raise self.WrongArguments
        id = data['Id']
        if not isinstance(id, int):
            try:
                id = int(id)
            except TypeError:
                raise self.WrongArguments
        return self.dbc.get_updates_since(id)

    def update_get_all_data(self) -> str:
        return self.dbc.get_all_data()

    # Chat ############

    def chat_messages_all(self) -> str:
        return json.dumps(self.dbc.get_all_messages())

    def chat_messages_since(self, res_json) -> str:
        data = json.loads(res_json)
        if not 'Id' in data:
            raise self.WrongArguments
        id = data['Id']
        if not isinstance(id, int):
            try:
                id = int(id)
            except TypeError:
                raise self.WrongArguments
            
        return json.dumps(self.dbc.get_messages_since(id))
            

    def chat_message_by_id(self, res_json) -> str:
        data = json.loads(res_json)
        if not 'Id' in data:
            raise self.WrongArguments
        id = data['Id']
        if not isinstance(id, int):
            try:
                id = int(id)
            except TypeError:
                raise self.WrongArguments

        r = self.dbc.get_message_by_id(id)
        return json.dumps(({'Messages': [r]}))
            

    def chat_message_send(self, rec_json) -> str:
        data = json.load(rec_json)
        if not data.keys() >= {'User', 'Character', 'Message'}:
            return '''{'Success' : false, 'Message': 'Not all variables defined!' }'''
        self.dbc.add_message(data['User'], data['Character'], data['Message'], False)
        return '''{'Success': true, 'Message': ''}'''
        

    def chat_command_exec(command: str) -> str:
        return '''{'Success': false, 'Message': 'Not implementet!' }'''

    def chat_macro_exec(id: int) -> str:
        return '''{'Success': false, 'Message': 'Not implementet!' }'''

    # Objects #########

    def bm_object_by_id(self, res_json) -> str:
        data = json.loads(res_json)
        if not 'Id' in data:
            raise self.WrongArguments

        id = data['Id']
        if not isinstance(id, int):
            try:
                id = int(id)
            except TypeError:
                raise self.WrongArguments

        return self.dbc.get_object_by_id(id)

    def bm_object_create(self, res_json) -> str:
        data = json.loads(res_json)
        if not( data.keys() >= {'Image_Id', 'Position'} \
            and data['Position'].keys() >= {'Level', 'Layer', 'Coords'} \
            and data['Position']['Coords'].keys() >= {'x', 'y', 'z_layer'}):
            raise self.WrongArguments
        
        image_id = data['Image_Id']
        if not isinstance(image_id, int):
            try:
                image_id = int(image_id)
            except TypeError:
                raise self.WrongArguments

        return self.dbc.add_object(image_id, data['Position'])
        
    def bm_object_delete(self, res_json) -> str:
        data = json.loads(res_json)
        if not data.keys() >= {'Id'}:
            raise self.WrongArguments
        id = data['Id']
        if not isinstance(id, int):
            try:
                id = int(id)
            except TypeError:
                raise self.WrongArguments
        r = self.dbc.delete_object(id)
        if r is None:
            raise self.NotExists
        else:
            return json.dumps({'Update_Id' : r})

    def bm_object_update_position(self, res_json) -> str:
        data = json.loads(res_json)
        if not (data.keys() >= {'Id', 'Position'} \
            and data['Position'].keys() >= {'Level', 'Layer', 'Coords'}\
            and data['Position']['Coords'].keys() >= {'x', 'y', 'z_layer'}):
            raise self.WrongArguments
        
        id = data['Id']
        if not isinstance(id, int):
            try:
                id = int(id)
            except TypeError:
                raise self.WrongArguments
        r = self.dbc.update_object_position(id, data['Position'])
        if r in None:
            raise self.NotExists
        return json.dumps({'Update_Id': r})

    def bm_object_update_transformation(self, res_json) -> str:
        data = json.loads(res_json)
        if not (data.keys() >= {'Id', 'Transformation'} \
            and data['Transformation'].keys() >= {'scale_x', 'scale_y', 'rotation'}):
            raise self.WrongArguments
        
        id = data['Id']
        if not isinstance(id, int):
            try:
                id = int(id)
            except TypeError:
                raise self.WrongArguments
        r = self.dbc.update_object_transformation(id, data['Transformation'])
        if r in None:
            raise self.NotExists
        return json.dumps({'Update_Id': r})

    # Tokens ##########

    def bm_token_by_id(self, res_json) -> str:
        data = json.loads(res_json)
        if not data.keys() >= {'Id'}:
            raise self.WrongArguments
        id = data['Id']
        if not isinstance(id, int):
            try:
                id = int(id)
            except TypeError:
                raise self.WrongArguments
        r = self.dbc.get_token_by_id(id)
        if r is None: 
            raise self.NotExists
        return r

    def bm_token_create(self, res_json) -> str:
        data = json.loads(res_json)
        if not data.keys() >= 'Object_Id':
            return self.WrongArguments
        id = data['Object_Id']
        if not isinstance(id, int):
            try:
                id = int(id)
            except:
                raise self.WrongArguments
        r = self.dbc.add_token(id, [], [])
        return json.dumps(r)

    def bm_token_delete(self, res_json) -> str:
        data = json.loads(res_json)
        if not data.keys() >= 'Token_Id':
            return self.WrongArguments
        id = data['Token_Id']
        if not isinstance(id, int):
            try:
                id = int(id)
            except:
                raise self.WrongArguments
        r = self.dbc.delete_token(id)
        if r is None:
            raise self.NotExists
        if 'Object_Id' in data:
            return self.bm_object_delete(data)
        return r
