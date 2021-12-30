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
        #self.parser = commandParser.CommandParser()

    # Utility functiion 

    def validate_json(self, json, key_list, key_types):
        if json is None:
            raise self.WrongArguments("Not a valid json")
        for i in range(0, len(key_list)):
            if key_list[i] not in json:
                raise self.WrongArguments("Missing key " + key_list[i])
            if not isinstance(json[key_list[i]], key_types[i]):
                raise self.WrongArguments(str(key_list[i]) + " is has wrong type")

    # Meta data ##########

    def get_all_data(self,data):
        '''Return dictionary containing all data about current battlemap and chat messages.'''
        self.validate_json(data, ['Room'], [str])
        btInfo = self.dbc.get_all_data(data['Room'])
        messages = self.dbc.get_all_messages(data['Room'])
        return {'Messages': messages['Messages'], 'Battlemap': btInfo}
    
    def new_room(self, data):
        '''Create new room with a battlemap with given names.'''
        self.validate_json(data, ['Name', 'Battlemap'], [str,str])
        self.dbc.add_new_room(data['Name'])
        self.dbc.create_battlemap(data['Name'], data['Battlemap'], [])
        self.dbc.set_battlemap(data['Name'], data['Battlemap'])

    def delete_room(self, data):
        '''Deletes room'''
        self.validate_json(data,['Room'], [str])
        self.dbc.delete_room(data['Room'])

    def get_game_list(self):
        '''Return list of avaible rooms'''
        res = self.dbc.get_all_rooms()
        return {'Games': res}

    # Chat ############

    def chat_messages_all(self):
        '''Return dictionary containing all chat messages'''
        return self.dbc.get_all_messages()
            
    def chat_message_send(self, data):
        '''Add new message do database and returns dictionary ready to be send to other players'''
        self.validate_json(data, ['User', 'Character', 'Text', 'Room'], [str,str,str,str])
        self.dbc.add_message(data['Room'], data['User'], data['Character'], data['Text'], False)
        return {'User': data['User'], 'Character': data['Character'], 'Text': data['Text'], 'Command': False}
        

    def chat_command_exec(command: str):
        return {'Success': False, 'Message': "Not implementet"}

    def chat_macro_exec(id: int):
        return {'Success': False, 'Message': "Not implementet"}

    # Objects #########

    def bm_object_create(self, data):
        '''Creates new object.'''
        self.validate_json(data, ['Image_Id','Position','Room'], [int, dict,str])
        self.validate_json(data['Position'], ['Level', 'Layer', 'Coords'], [int,int,dict])
        self.validate_json(data['Position']['Coords'], ['x','y','z_layer'], [float, float, int])
        return self.dbc.add_object(data['Room'], data['Image_Id'], data['Position'])
        
    def bm_object_delete(self, data):
        '''Deletes object by id'''
        self.validate_json(data, ['Id','Room'], [int,str])
        success = self.dbc.delete_object(data['Room'], data['Id'])
        if success is True:
            return {"Id": data["Id"]}
        raise self.Failure("Object delete position failed at bdcontroller")

    def bm_object_update_position(self, data):
        '''Updates object position and return dictionary with new position ready to be send to other players'''
        self.validate_json(data, ['Id', 'Position'], [int, dict])
        self.validate_json(data['Position'], ['Level', 'Layer', 'Coords'], [int,int,dict])
        self.validate_json(data['Position']['Coords'], ['x','y','z_layer'],[float, float,int])

        success = self.dbc.update_object_position(data['Room'], data['Id'], data['Position'])
        if success in True:
            return {'Id' : data['Id'], 'Position': data['Position']}
        raise self.Failure("Object update position failed at bdcontroller")

    def bm_object_update_transformation(self, data):
        '''Updates object transformation and return dictionary with new position ready to be send to other players'''
        self.validate_json(data, ['Id', 'Transformation','Room'], [int, dict,str])
        self.validate_json(data['Transformation'], ['scale_x', 'scale_y', 'rotation'], [float,float,float])
        success = self.dbc.update_object_transformation(data['Room'], data['Id'], data['Transformation'])
        if success in True:
            return {'Id': data['Id'], 'Transformation' : data['Transformation']}
        raise self.Failure("Object update transformation failed at bdcontroller")

    # Tokens ##########

    def bm_token_create(self, data):
        '''Creates new token given a base object id'''
        self.validate_json(data, ['Id', 'Room'], [int,str])
        r = self.dbc.add_token(data['Room'], data['Id'], [], [])
        return r

    def bm_token_delete(self, data):
        '''Deletes token by id'''
        self.validate_json(data, ['Token_Id', 'Room'], [int,str])
        success = self.dbc.delete_token(data['Room'], data['Token_Id'])
        if success is True: 
            return {"Id": data['Token_Id']}
        raise self.Failure("Token delete failed at bdcontroller")
