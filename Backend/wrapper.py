import json 
import dbcontroller
import random
from PIL import Image
import io

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
        self.desiredX = 70
        self.desiredY = 70
        #self.parser = commandParser.CommandParser()

    # Utility functiion 

    def validate_json(self, json, key_list, key_types):
        if json is None:
            raise self.WrongArguments("Not a valid json")
        for i in range(0, len(key_list)):
            if key_list[i] not in json:
                raise self.WrongArguments("Missing key " + key_list[i])
            if(key_types[i] == any):
                continue
            elif not isinstance(json[key_list[i]], key_types[i]):
                raise self.WrongArguments(str(key_list[i]) + " is has wrong type")

    # Meta data ##########

    def get_all_data(self,data):
        '''Return dictionary containing all data about current battlemap and chat messages.'''
        self.validate_json(data, ['Room'], [str])
        btInfo = self.dbc.get_all_data(data['Room'])
        messages = self.dbc.get_all_messages(data['Room'])
        images = self.dbc.get_all_images(data['Room'])
        sheets = self.dbc.get_all_character_sheets(data['Room'])
        return {'Messages': messages['Messages'], 'Battlemap': btInfo, 'Images': images, 'Sheets': sheets}
    
    def new_room(self, data):
        '''Create new room with a battlemap with given names.'''
        print("Creating room")
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
        

    def chat_command_exec(self, data):
        self.validate_json(data, ['User', 'Character', 'Command', 'Room'], [str,str,str,str])
        text = data['Command']
        command = text.split(' ', 2)
        if command[0] == '/roll':
            
            a = command[1].split('d',2)
            b = a[1].split('+',2)
            print(a)
            print(b)
            try:
                n = int(a[0])
                d = int(b[0])
                m = 0
                if len(b)>1:
                    m = int(b[1])
                rsum = 0
                for i in range(n):
                    roll = random.randint(1,d)
                    rsum += roll
                rsum += m 
                self.dbc.add_message(data['Room'], data['User'], data['Character'], "Rolled:" + str(rsum), True)
                return {'User': data['User'], 'Character': data['Character'], 'Text': "Rolled:" + str(rsum), 'Command': True}
            except Exception as e:
                print(e)
                raise self.WrongArguments("Not a valid command") 
        if command[0] == '/add':
            temp = {
                    "Id":1,
                    "Image_Name": command[2],
                    "Position": {
                        "Level": 0,
                        "Layer": -1,
                        "Coords": {
                            "x": 310.0, 
                            "y": 190.0, 
                            "z_layer": 1 
                        }
                    },
                    "Transformation": {
                        "scale_x": 0.05,
                        "scale_y": 0.05, 
                        "rotation": 0
                        }
                    }
            if command[1] == 'bard':
                createdObject = self.dbc.add_object(data['Room'], command[2], temp['Position'], temp['Transformation'])
                temp['Id'] = createdObject['Id']
                temp_json = json.dumps(temp)    
                return {'inner_json': temp_json, 'cmd': "add"}
            if command[1] == 'kaplan':
                #temp['Image_Id'] = 2
                createdObject = self.dbc.add_object(data['Room'], command[2], temp['Position'], temp['Transformation'])
                temp['Id'] = createdObject['Id']
                y = json.dumps(temp)    
                return {'inner_json': y, 'cmd': "add"}
            if command[1] == 'lotrzyk':
                #temp['Image_Id'] = 3
                temp['Transformation']['scale_x'] = 0.07
                temp['Transformation']['scale_y'] = 0.07
                createdObject = self.dbc.add_object(data['Room'], command[2], temp['Position'], temp['Transformation'])
                temp['Id'] = createdObject['Id']
                y = json.dumps(temp)    
                return {'inner_json': y, 'cmd': "add"}
            if command[1] == 'mag':
                #temp['Image_Id'] = 4
                temp['Transformation']['scale_x'] = 0.14
                temp['Transformation']['scale_y'] = 0.14
                createdObject = self.dbc.add_object(data['Room'], command[2], temp['Position'], temp['Transformation'])
                temp['Id'] = createdObject['Id']
                y = json.dumps(temp)    
                return {'inner_json': y, 'cmd': "add"}
            if command[1] == 'paladyn':
                #temp['Image_Id'] = 5
                temp['Transformation']['scale_x'] = 0.05
                temp['Transformation']['scale_y'] = 0.05
                createdObject = self.dbc.add_object(data['Room'], command[2], temp['Position'], temp['Transformation'])
                temp['Id'] = createdObject['Id']
                y = json.dumps(temp)    
                return {'inner_json': y, 'cmd': "add"}
            if command[1] == 'wojownik':   
                #temp['Image_Id'] = 6
                temp['Transformation']['scale_x'] = 0.11
                temp['Transformation']['scale_y'] = 0.11
                createdObject = self.dbc.add_object(data['Room'], command[2], temp['Position'], temp['Transformation'])
                temp['Id'] = createdObject['Id']
                y = json.dumps(temp)    
                return {'inner_json': y, 'cmd': "add"} 
            if command[1] == "map":
                #temp['Image_Id'] = 0
                temp['Transformation']['scale_x'] = 1
                temp['Transformation']['scale_y'] = 1
                temp['Position']['Layer'] = 1
                temp['Position']['Coords']['x'] = 600
                temp['Position']['Coords']['y'] = 600
                temp['Position']['Coords']['z_layer'] = -1
                createdObject = self.dbc.add_object(data['Room'], command[2], temp['Position'], temp['Transformation'])
                temp['Id'] = createdObject['Id']
                y = json.dumps(temp)    
                return {'inner_json': y, 'cmd': "add"} 
        raise self.WrongArguments("Not a valid command")
              
    def chat_macro_exec(id: int):
        return {'Success': False, 'Message': "Not implementet"}

    # Objects #########

    def get_transform(self, img):
        ext = 'none'
        for k in img.keys():
            if k != 'Name':
                ext = k
        
        im = Image.open(io.BytesIO(img[ext]))
        xScale = float(self.desiredX) / float(im.size[0])
        yScale = float(self.desiredY) / float(im.size[1])
        
        transform = {'scale_x': xScale, 'scale_y': yScale, 'rotation': 0.0}
        print(transform)
        return transform
        

    def bm_object_create(self, data):
        '''Creates new object.'''
        self.validate_json(data, ['Image_Name','Position','Room'], [str, dict, str])
        self.validate_json(data['Position'], ['Level', 'Layer', 'Coords'], [int,int,dict])
        self.validate_json(data['Position']['Coords'], ['x','y','z_layer'], [any, any, int])
        scale = self.get_transform(self.dbc.get_image_by_name(data['Room'], data['Image_Name']))
        print("Adding object to database")
        return self.dbc.add_object(data['Room'], data['Image_Name'], data['Position'], scale)
        
    def bm_object_delete(self, data):
        '''Deletes object by id'''
        self.validate_json(data, ['Id','Room'], [int,str])
        success = self.dbc.delete_object(data['Room'], data['Id'])
        if success is True:
            return {"Id": data["Id"]}
        raise self.Failure("Object delete position failed at bdcontroller")

    def bm_object_update_position(self, data):
        '''Updates object position and return dictionary with new position ready to be send to other players'''
        self.validate_json(data, ['Id', 'Position', 'Room'], [int, dict, str])
        self.validate_json(data['Position'], ['Level', 'Layer', 'Coords'], [int,int,dict])
        #self.validate_json(data['Position']['Coords'], ['x','y','z_layer'],[float, float,int])
        #print(data)
        
        success = self.dbc.update_object_position(data['Room'], data['Id'], data['Position'])
         
        if success:  
            return {'Id' : data['Id'], 'Position': data['Position']}
        raise self.Failure("Object update position failed at bdcontroller")

    def bm_object_update_transformation(self, data):
        '''Updates object transformation and return dictionary with new position ready to be send to other players'''
        self.validate_json(data, ['Id', 'Transformation','Room'], [int, dict,str])
        self.validate_json(data['Transformation'], ['scale_x', 'scale_y', 'rotation'], [any,any,any])
        success = self.dbc.update_object_transformation(data['Room'], data['Id'], data['Transformation'])
        if success is True:
            return {'Id': data['Id'], 'Transformation' : data['Transformation']}
        raise self.Failure("Object update transformation failed at bdcontroller")

    # Images ##########

    def img_new(self, data):
        self.validate_json(data,['Room','Name'],[str,str])
        self.dbc.add_image(data['Room'], data['Image'],data['Name'])
        return {"Name": data['Name'], 'Image': data['Image']}

    def img_delete(self, data): 
        self.validate_json(data,['Room','Name'],[str,str])
        self.dbc.delete_image(data['Room'],data['Name'])
        return {'Name': data['Name']}
    
    def img_get(self, data):
        print(data)
        self.validate_json(data,['Room','Name'],[str,str])
        temp = self.dbc.get_image_by_name(data['Room'], data['Name'])
        temp['Name'] = data['Name']
        return temp

    def img_get_all(self, data):
        print("Received img_get_all")
        self.validate_json(data, ['Room'], [str])
        return self.dbc.get_all_images(data['Room'])
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

    # Sheets #########
    def sheet_add(self, data):
        self.validate_json(data, ['Room', 'Name','Equipment','Abilities'],[str,str,any,any])
        new_character = {'Name': data['Name'], 'Equipment':data['Equipment'], 'Abilities':data['Abilities']}
        id = self.dbc.add_character_sheet(data['Room'], new_character)
        new_character['Id'] = id
        return new_character

    def sheet_delete(self, data):
        self.validate_json(data, ['Room', 'Id'],[str,int])
        self.dbc.delete_character_sheet(data['Room'],data['Id'])
        return {'Id': data['Id']}

    def sheets_get_all(self, data):
        self.validate_json(data, ['Room'], [str])
        res = self.dbc.get_all_character_sheets(data['Room'])
        return res

    def sheet_edit(self, data):
        self.validate_json(data, ['Room', 'Id','Equipment', 'Abilities'], [str, int, any, any])
        sheet = {'Name': data['Name'], 'Equipment': data['Equipment'], 'Abilities': data['Abilities'], 'Id': data['Id']}
        self.dbc.modify_character_sheet(data['Room'], data['Id'], sheet)
        return sheet