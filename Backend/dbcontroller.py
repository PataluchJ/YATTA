import pymongo
from pymongo import MongoClient


class Controller():

    def __init__(self) -> None:
        self.client = MongoClient()
        self.db = self.client.mydb
        self.messages = self.db.messages
        self.macros = self.db.macros
        self.tokens = self.db.tokens
        self.objects = self.db.objects
        self.battlemap = self.db.battlemap
        self.changes = self.db.changes
        self.msg_id = 0
        self.macro_id = 0
        self.token_id = 0
        self.obj_id = 0
        self.update_id = -1
        self.clear_db()
        self.blank_trsf = {
            "scale_x": 1,
            "scale_y": 1,
            "rotation": 0
        }

    def clear_db(self):
        self.messages.delete_many({})
        self.changes.delete_many({})
        self.macros.delete_many({})
        self.tokens.delete_many({})
        self.objects.delete_many({})
        self.battlemap.delete_many({})

    # MESSAGES

    def add_message(self, user: str, character: str, message: str, command: bool):
        post = {
            "_id": self.msg_id,
            "User": user,
            "Character": character,
            "Text": message,
            "Command": command
        }
        self.msg_id += 1
        self.messages.insert_one(post)

    def get_all_messages(self):
        results = {"Messages": []}
        all_messages = self.messages.find()
        for message in all_messages:
            results["Messages"].append(message)
        return results

    def get_message_by_id(self, id: int):
        return self.messages.find_one({"_id": id})

    def get_messages_since(self, id: int):
        result = {"Messages": []}
        all_messages = self.messages.find({"_id": {"$gte": id}})
        for message in all_messages:
            result["Messages"].append(message)
        return result

    # MACROS

    def add_macro(self, macro: str):
        # TODO
        pass

    # TOKENS

    def add_token(self, object_id: int, bars: list, auras: list):
        post = {
            "_id": self.token_id,
            "Object_id": object_id,
            "Linked_sheet_id": None,
            "Bars": bars,
            "Auras": auras
        }
        self.tokens.insert_one(post)
        self.update_id += 1
        self.update_last_id()
        self.add_new_update('token', self.token_id, "added")
        self.battlemap.update_one({}, {"$push": {"Tokens": self.token_id}})
        self.token_id += 1
        ids = {
            "Token_Id": self.token_id-1,
            "Update_Id": self.update_id
        }
        return ids

    def get_token_by_id(self, id: int):
        return self.tokens.find_one({"_id": id})

    def delete_token(self, id: int):
        token = self.tokens.find_one({"_id": id})
        if token:
            obj_id = token["Object_id"]
            self.tokens.delete_one({"_id": id})
            self.battlemap.update_one({}, {"$pull": {"Tokens": id}})
            self.objects.delete_one({"_id": obj_id})
            self.battlemap.update_one({}, {"$pull": {"Objects": obj_id}})
            self.update_id += 1
            self.update_last_id()
            self.add_new_update('token', id, "removed")
            return self.update_id
        return None

    # OBJECTS

    def add_object(self, image_id: int, position: dict):
        post = {
            "_id": self.obj_id,
            "Image_id": image_id,
            "Position": position,
            "Transformation": self.blank_trsf
        }
        self.objects.insert_one(post)
        self.update_id += 1
        self.update_last_id()
        self.add_new_update('object', self.obj_id, "added")
        self.battlemap.update_one({}, {"$push": {"Objects": self.obj_id}})
        self.obj_id += 1
        ids = {
            "Object_Id": self.obj_id-1,
            "Update_Id": self.update_id
        }
        return ids

    def get_object_by_id(self, id: int):
        return self.objects.find_one({"_id": id})

    def delete_object(self, id: int):
        obj = self.objects.find_one({"_id": id})
        if obj:
            self.objects.delete_one({"_id": id})
            self.battlemap.update_one({}, {"$pull": {"Objects": id}})
            self.update_id += 1
            self.update_last_id()
            self.add_new_update('object', self.obj_id, "removed")
            return self.update_id
        return None

    def update_object_position(self, id: int, position: dict):
        obj = self.objects.find_one({"_id": id})
        if obj:
            self.objects.update_one(
                {"_id": id}, {"$set": {"Position.Level": position['Level'],
                                       "Position.Layer": position['Layer'],
                                       "Position.Coords.x": position['Coords']['x'],
                                       "Position.Coords.y": position['Coords']['y'],
                                       "Position.Coords.z_layer": position['Coords']['z_layer']}})
            self.update_id += 1
            self.update_last_id()
            self.add_new_update('object', id, "changed position")
            return self.update_id
        return None

    def update_object_transformation(self, id: int, tr: dict):
        obj = self.objects.find_one({"_id": id})
        if obj:
            self.objects.update_one({"_id": id}, {"$set": {
                                    "Transformation.scale_x": tr['scale_x'],
                                    "Transformation.scale_y": tr['scale_y'],
                                    "Transformation.rotation": tr['rotation']}})
            self.update_id += 1
            self.update_last_id()
            self.add_new_update('object', id, "transformed")
            return self.update_id
        return None

    # UDPATE LIST

    def add_new_update(self, type: str, id: int, description: str):
        """Not intended for external use"""
        post = {
            "_id": self.update_id,
            "Type": type,
            "Type_Id": id,
            "Description": description
        }
        self.changes.insert_one(post)

    def get_last_update_id(self):
        result = {"Last_Id": self.update_id}
        return result

    def get_updates_since(self, id: int):
        results = {"Updates": []}
        all_updates = self.changes.find({"_id": {"$gte": id}})
        for update in all_updates:
            results["Updates"].append(update)
        return results

    # BATTLEMAP

    def create_battlemap(self, name: str, lvl_names: list):
        post = {
            "Name": name,
            "Levels_names": lvl_names,
            "Objects": [],
            "Tokens": [],
            "Last_update": self.update_id
        }
        self.battlemap.insert_one(post)

    def update_last_id(self):
        """Not intended for external use"""
        self.battlemap.update_one(
            {}, {"$set": {"Last_update": self.update_id}})

    def get_all_data(self):
        all_tokens = self.tokens.find()
        tokens = []
        for token in all_tokens:
            tokens.append(token)
        all_objects = self.objects.find()
        objects = []
        for object in all_objects:
            objects.append(object)

        bmap = self.battlemap.find_one()

        result = {
            "Battlemap": {
                "Name": bmap["Name"],
                "Levels_Names": bmap["Levels_names"],
                "Objects": objects,
                "Tokens": tokens
            },
            "Last_update": bmap["Last_update"]
        }
        return result
