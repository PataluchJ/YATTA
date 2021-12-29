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
            "object_id": 0,
            "macros": [],
            "battlemap": {},
            "battlemaps": []
        }
        self.rooms.insert_one(post)

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
        id = post["Id"],

        self.rooms.update_one({"room_name": room}, {"$inc": {"token_id": 1}})
        self.rooms.update_one({"room_name": room}, {"$push": {"battlemap.Tokens": post}})

        return id

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
            return 1
        return -1

    # OBJECTS

    def add_object(self, room: str, image_id: int, position: dict):
        post = {
            "Id": self.rooms.find_one({"room_name": room})["object_id"],
            "Image_id": image_id,
            "Position": position,
            "Transformation": self.blank_trsf
        }
        id = post["Id"],

        self.rooms.update_one({"room_name": room}, {"$inc": {"object_id": 1}})
        self.rooms.update_one({"room_name": room}, {"$push": {"battlemap.Objects": post}})
        
        return id

    def delete_object(self, room: str, id: int):
        objects = self.rooms.find_one({"room_name": room})["battlemap"]["Objects"]
        result = None
        for obj in objects:
            if obj["Id"] == id:
                result = obj
        if result:
            self.rooms.update_one({"room_name": room}, {"$pull": {"battlemap.Objects": result}})
            return 1
        return -1

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
            return 1
        return -1

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
            return 1
        return -1


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
        bmaps = self.rooms.find_one({"room_name": room})["battlemaps"]
        for bmap in bmaps:
            if bmap["Name"] == name:
                print(bmap)
                self.rooms.update_one({"room_name": room}, {"$set": {"battlemap": bmap}})
                break

    def get_all_data(self, room: str):
        bmap = self.rooms.find_one({"room_name": room})["battlemap"]
        result = {"Battlemap": bmap}
        return result
