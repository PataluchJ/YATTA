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
            "msg_id": 0,
            "tokens": [],
            "token_id": 0,
            "objects": [],
            "object_id": 0,
            "macros": [],
            "macro_id": 0,
            "changes": [],
            "update_id": 0,
            "battlemap": {}
        }
        self.rooms.insert_one(post)

    # MESSAGES

    def add_message(self, room: str, user: str, character: str, message: str, command: bool):
        post = {
            "Id": self.rooms.find_one({"room_name": room})["msg_id"],
            "User": user,
            "Character": character,
            "Text": message,
            "Command": command
        }
        self.rooms.update_one({"room_name": room}, {"$inc": {"msg_id": 1}})
        self.rooms.update_one({"room_name": room}, {"$push": {"messages": post}})

    def get_all_messages(self, room: str):
        results = {"Messages": []}
        all_messages = self.rooms.find_one({"room_name": room})["messages"]
        for message in all_messages:
            message.pop("_id", None)
            results["Messages"].append(message)
        return results

    def get_message_by_id(self, room: str, id: int):
        message = self.rooms.find_one({"room_name": room})["messages"][id]
        message.pop("_id", None)
        return message

    def get_messages_since(self, room: str, id: int):
        result = {"Messages": []}
        messages = self.rooms.find_one({"room_name": room})["messages"][id:]
        for message in messages:
            message.pop("_id", None)
            result["Messages"].append(message)
        return result

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
        ids = {
            "Token_Id": post["Id"],
            "Update_Id": self.rooms.find_one({"room_name": room})["update_id"]
        }

        self.add_new_update(room, 'Token', self.rooms.find_one({"room_name": room})["token_id"], "added")
        
        self.rooms.update_one({"room_name": room}, {"$inc": {"token_id": 1, "update_id": 1}})
        self.rooms.update_one({"room_name": room}, {"$push": {"tokens": post}})
        self.update_last_id(room)
        self.rooms.update_one({"room_name": room}, {"$push": {"battlemap.Tokens": post["Id"]}})

        return ids

    def get_token_by_id(self, room: str, id: int):
        tokens = self.rooms.find_one({"room_name": room})["tokens"]
        result = None
        for token in tokens:
            if token["Id"] == id:
                result = token
        result.pop("_id", None)
        return result

    def delete_token(self, room: str, id: int):
        tokens = self.rooms.find_one({"room_name": room})["tokens"]
        result = None
        for token in tokens:
            if token["Id"] == id:
                result = token
        if result:
            self.rooms.update_one({"room_name": room}, {"$pull": {"tokens": result}})
            self.add_new_update(room, 'Token', id, "removed")
            self.rooms.update_one({"room_name": room}, {"$pull": {"battlemap.Tokens": id}})
            self.update_last_id(room)
            self.rooms.update_one({"room_name": room}, {"$inc": {"update_id": 1}})
            obj_id = result["Object_id"]
            self.delete_object(room, obj_id)
            return self.rooms.find_one({"room_name": room})["update_id"]-1
        return None

    # OBJECTS

    def add_object(self, room: str, image_id: int, position: dict):
        post = {
            "Id": self.rooms.find_one({"room_name": room})["object_id"],
            "Image_id": image_id,
            "Position": position,
            "Transformation": self.blank_trsf
        }
        ids = {
            "Object_Id": post["Id"],
            "Update_Id": self.rooms.find_one({"room_name": room})["update_id"]
        }

        self.add_new_update(room, 'Object', post["Id"], "added")

        self.rooms.update_one({"room_name": room}, {"$inc": {"object_id": 1, "update_id": 1}})
        self.rooms.update_one({"room_name": room}, {"$push": {"objects": post}})
        self.update_last_id(room)
        self.rooms.update_one({"room_name": room}, {"$push": {"battlemap.Objects": post["Id"]}})
        
        return ids

    def get_object_by_id(self, room: str, id: int):
        objects = self.rooms.find_one({"room_name": room})["objects"]
        result = None
        for obj in objects:
            if objects["Id"] == id:
                result = obj
        result.pop("_id", None)
        return result

    def delete_object(self, room: str, id: int):
        objects = self.rooms.find_one({"room_name": room})["objects"]
        result = None
        for obj in objects:
            if obj["Id"] == id:
                result = obj
        if result:
            self.rooms.update_one({"room_name": room}, {"$pull": {"objects": result}})
            self.add_new_update(room, 'Object', id, "removed")
            self.rooms.update_one({"room_name": room}, {"$pull": {"battlemap.Objects": id}})
            self.update_last_id(room)
            self.rooms.update_one({"room_name": room}, {"$inc": {"update_id": 1}})
            return self.rooms.find_one({"room_name": room})["update_id"]-1
        return None

    def update_object_position(self, room: str, id: int, position: dict):
        objects = self.rooms.find_one({"room_name": room})["objects"]
        result = None
        for obj in objects:
            if obj["Id"] == id:
                result = obj
        if result:
            self.rooms.update_one({"room_name": room}, {"$pull": {"objects": result}})
            result['Position']['Level'] = position['Level']
            result['Position']['Layer'] = position['Layer']
            result['Position']['Coords']['x'] = position['Coords']['x']
            result['Position']['Coords']['y'] = position['Coords']['y']
            result['Position']['Coords']['z_layer'] = position['Coords']['z_layer']
            self.rooms.update_one({"room_name": room}, {"$push": {"objects": result}})
            self.rooms.update_one({"room_name": room}, {"$inc": {"update_id": 1}})
            self.update_last_id(room)
            self.add_new_update(room, 'Object', id, "changed position")
            return self.rooms.find_one({"room_name": room})['update_id']-1
        return None

    def update_object_transformation(self, room: str, id: int, tr: dict):
        objects = self.rooms.find_one({"room_name": room})["objects"]
        result = None
        for obj in objects:
            if obj["Id"] == id:
                result = obj
        if result:
            self.rooms.update_one({"room_name": room}, {"$pull": {"objects": result}})
            result["Transformation"]["scale_x"] = tr['scale_x']
            result["Transformation"]["scale_y"] = tr['scale_y']
            result["Transformation"]["rotation"] = tr['rotation']
            self.rooms.update_one({"room_name": room}, {"$push": {"objects": result}})
            self.rooms.update_one({"room_name": room}, {"$inc": {"update_id": 1}})
            self.update_last_id(room)
            self.add_new_update(room, 'Object', id, "transformed")
            return self.rooms.find_one({"room_name": room})['update_id']-1
        return None

    # UDPATE LIST

    def add_new_update(self, room: str, type: str, id: int, description: str):
        """Not intended for external use"""
        post = {
            "Id": self.rooms.find_one({"room_name": room})["update_id"],
            "Where": type,
            "Reference_Id": id
        }
        self.rooms.update_one({"room_name": room}, {"$push": {"changes": post}})

    def get_last_update_id(self, room: str):
        result = {"Last_Id": self.rooms.find_one({"room_name": room})["update_id"]-1}
        return result

    def get_updates_since(self, room: str, id: int):
        results = {"Updates": []}
        updates = self.rooms.find_one({"room_name": room})["changes"][id:]
        for update in updates:
            update.pop("_id", None)
            results["Updates"].append(update)
        return results

    # BATTLEMAP

    def create_battlemap(self, room: str, name: str, lvl_names: list):
        post = {
            "Name": name,
            "Levels_names": lvl_names,
            "Objects": [],
            "Tokens": [],
            "Last_update": self.rooms.find_one({"room_name": room})["update_id"]-1
        }
        self.rooms.update_one({"room_name": room}, {"$set": {"battlemap": post}})

    def update_last_id(self, room: str):
        """Not intended for external use"""
        self.rooms.update_one({"room_name": room}, {"$inc": {"battlemap.Last_update": 1}})

    def get_all_data(self, room: str):
        tokens = self.rooms.find_one({"room_name": room})["tokens"]
        objects = self.rooms.find_one({"room_name": room})["objects"]
        bmap = self.rooms.find_one({"room_name": room})["battlemap"]

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
