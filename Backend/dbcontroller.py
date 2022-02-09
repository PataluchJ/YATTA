from xml.etree.ElementTree import tostring
from pymongo import MongoClient


class Controller():

    def __init__(self) -> None:
        self.client = MongoClient()
        self.db = self.client.mydb
        self.rooms = self.db.rooms

        self.blank_trsf = {
            "scale_x": 1,
            "scale_y": 1,
            "rotation": 0
        }

    def add_new_room(self, name: str) -> None:
        post = {
            "room_name": name,
            "messages": [],
            "token_id": 0,
            "char_sheet_id": 0,
            "object_id": 0,
            "macros": [],
            "char_sheets": [],
            "images": {},
            "battlemap": {},
            "battlemaps": []
        }
        self.rooms.insert_one(post)

    def get_all_rooms(self) -> list:
        """Returns a list contatining names of all available rooms"""
        all_rooms = self.rooms.find()
        names = []
        for room in all_rooms:
            names.append(room["room_name"])
        return names

    def delete_room(self, room: str):
        self.rooms.delete_one({"room_name": room})

    # MESSAGES

    def add_message(self, room: str, user: str, character: str, message: str, command: bool):
        post = {
            "User": user,
            "Character": character,
            "Text": message,
            "Command": command
        }
        self.rooms.update_one({"room_name": room}, {"$push": {"messages": post}})

    def get_all_messages(self, room: str):
        results = {"Messages": []}
        all_messages = self.rooms.find_one({"room_name": room})["messages"]
        for message in all_messages:
            message.pop("_id", None)
            results["Messages"].append(message)
        return results

    # MACROS

    def add_macro(self, macro: str):
        # TODO
        pass

    # TOKENS

    def add_token(self, room: str, object_id: int, bars: list, auras: list):
        post = {
            "Id": self.rooms.find_one({"room_name": room})["token_id"],
            "Object_id": object_id,
            "Linked_sheet_id": None,
            "Bars": bars,
            "Auras": auras
        }

        self.rooms.update_one({"room_name": room}, {"$inc": {"token_id": 1}})
        self.rooms.update_one({"room_name": room}, {"$push": {"battlemap.Tokens": post}})

        return post

    def delete_token(self, room: str, id: int):
        tokens = self.rooms.find_one({"room_name": room})['battlemap']['Tokens']
        result = None
        for token in tokens:
            if token["Id"] == id:
                result = token
        if result:
            self.rooms.update_one({"room_name": room}, {"$pull": {"battlemap.Tokens": result}})
            obj_id = result["Object_id"]
            self.delete_object(room, obj_id)
            return True
        return False

    # OBJECTS

    def add_object(self, room: str, image_name: str, position: dict, transformation: dict):
        post = {
            "Id": self.rooms.find_one({"room_name": room})["object_id"],
            "Image_Name": image_name,
            "Position": position,
            "Transformation": transformation
        }
        self.rooms.update_one({"room_name": room}, {"$inc": {"object_id": 1}})
        self.rooms.update_one({"room_name": room}, {"$push": {"battlemap.Objects": post}})
        return post

    def delete_object(self, room: str, id: int):
        objects = self.rooms.find_one({"room_name": room})["battlemap"]["Objects"]
        result = None
        for obj in objects:
            if obj["Id"] == id:
                result = obj
        if result:
            self.rooms.update_one({"room_name": room}, {"$pull": {"battlemap.Objects": result}})
            return True
        return False

    def update_object_position(self, room: str, id: int, position: dict):
        
        objects = self.rooms.find_one({"room_name": room})["battlemap"]["Objects"]
        result = None
       
        for obj in objects:
            if obj["Id"] == id:
                result = obj
        if result:
            self.rooms.update_one({"room_name": room}, {"$pull": {"battlemap.Objects": result}})
            result['Position']['Level'] = position['Level']
            result['Position']['Layer'] = position['Layer']
            result['Position']['Coords']['x'] = position['Coords']['x']
            result['Position']['Coords']['y'] = position['Coords']['y']
            result['Position']['Coords']['z_layer'] = position['Coords']['z_layer']
            self.rooms.update_one({"room_name": room}, {"$push": {"battlemap.Objects": result}})
            return True
        return False

    def update_object_transformation(self, room: str, id: int, tr: dict):
        objects = self.rooms.find_one({"room_name": room})["battlemap"]["Objects"]
        result = None
        for obj in objects:
            if obj["Id"] == id:
                result = obj
        if result:
            self.rooms.update_one({"room_name": room}, {"$pull": {"battlemap.Objects": result}})
            result["Transformation"]["scale_x"] = tr['scale_x']
            result["Transformation"]["scale_y"] = tr['scale_y']
            result["Transformation"]["rotation"] = tr['rotation']
            self.rooms.update_one({"room_name": room}, {"$push": {"battlemap.Objects": result}})
            return True
        return False


    # BATTLEMAP

    def create_battlemap(self, room: str, name: str, lvl_names: list):
        post = {
            "Name": name,
            "Levels_names": lvl_names,
            "Objects": [],
            "Tokens": [],
        }
        self.rooms.update_one({"room_name": room}, {"$push": {"battlemaps": post}})

    def delete_battlemap(self, room: str, name: str):
        bmaps = self.rooms.find_one({"room_name": room})["battlemaps"]
        for bmap in bmaps:
            if bmap["Name"] == name:
                self.rooms.update_one({"room_name": room}, {"$pull": {"battlemaps": bmap}})
                break

    def set_battlemap(self, room: str, name: str):
        # Apply changes made to previous battlemap to its counterpart in battlemaps list
        curr_bmap = self.rooms.find_one({"room_name": room})["battlemap"]
        if curr_bmap:
            bmaps = self.rooms.find_one({"room_name": room})["battlemaps"]
            for bmap in bmaps:
                if bmap["Name"] == curr_bmap["Name"]:
                    self.rooms.update_one({"room_name": room}, {"$pull": {"battlemaps": bmap}})
                    self.rooms.update_one({"room_name": room}, {"$push": {"battlemaps": curr_bmap}})
                    break
        
        #Change current battlemap
        bmaps = self.rooms.find_one({"room_name": room})["battlemaps"]
        for bmap in bmaps:
            if bmap["Name"] == name:
                self.rooms.update_one({"room_name": room}, {"$set": {"battlemap": bmap}})
                break
    
    def add_level(self, room: str, lvl_name: str):
        self.rooms.update_one({"room_name": room}, {"$push": {"battlemap.Levels_names": lvl_name}})

    def delete_level(self, room: str, lvl_name: str):
        self.rooms.update_one({"room_name": room}, {"$pull": {"battlemap.Levels_names": lvl_name}})

    def get_all_battlemaps(self, room: str) -> list:
        "Returns a list containing all available battlemap names in a given room"
        bmaps = self.rooms.find_one({"room_name": room})["battlemaps"]
        names = []
        for bmap in bmaps:
            names.append(bmap["Name"])
        return names

    def get_all_data(self, room: str):
        res = self.rooms.find_one({"room_name": room})['battlemap']
        return res


    ### IMAGES

    def add_image(self, room: str, img_data, img_name: str):
        print("DBC 1")
        self.rooms.update_one({"room_name": room}, {"$set": {f"images.{img_name}": img_data}})
        print("DBC 2")

    def delete_image(self, room: str, img_name: str):
        self.rooms.update_one({"room_name": room}, {"$unset": {f"images.{img_name}": ""}})

    def get_all_images(self, room: str):
        images = self.rooms.find_one({"room_name": room})["images"]
        for k in images.keys():
            images[k]['Name'] = k
        return images

    def get_image_by_name(self, room: str, img_name: str):
        images = self.rooms.find_one({"room_name": room})["images"]
        image = images[img_name]
        image['Name'] = img_name
        return image


    ### CHARACTER SHEETS

    def add_character_sheet(self, room: str, sheet: dict):
        sheet_id = self.rooms.find_one({"room_name": room})["char_sheet_id"]
        sheet['Id'] = sheet_id
        self.rooms.update_one({"room_name": room}, {"$set": {f"char_sheets.{sheet_id}": sheet}})
        self.rooms.update_one({"room_name": room}, {"$inc": {"char_sheet_id": 1}})
        return sheet_id

    def delete_character_sheet(self, room: str, id: int):
        self.rooms.update_one({"room_name": room}, {"$unset": {f"char_sheets.{id}": ""}})

    def get_all_character_sheets(self, room: str):
        return self.rooms.find_one({"room_name": room})["char_sheets"]

    def get_character_sheet_by_id(self, room: str, id: int):
        char_sheets = self.rooms.find_one({"room_name": room})["char_sheets"]
        return char_sheets[str(id)]

    def modify_character_sheet(self, room: str, id: int, modified_sheet: dict):
        self.rooms.update_one({"room_name": room}, {"$set": {f"char_sheets.{id}": modified_sheet}})
