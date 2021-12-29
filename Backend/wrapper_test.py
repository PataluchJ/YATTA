import json
import unittest
import wrapper

wp = wrapper.Wrapper()

class TestWrapper(unittest.TestCase):

    ''' Tests require working database with test records.'''

    # Message tests

    def test_chat(self):
        f = open('Test_Records/messages.json')
        messages = json.load(f)
        f.close()

        # All message test
        all_message_list = {'Messages' : messages}
        self.assertEqual(all_message_list, json.loads(wp.chat_messages_all()), 'Get all messages.')
        
        # Message by ID
        # Get
        id = 2
        id_message_list = {'Messages': [messages[id]]}
        id_message_arg = json.dumps({"Id": id})
        self.assertEqual(id_message_list, json.loads(wp.chat_message_by_id(id_message_arg)), 'Get by id message.')

        # Message since 
        id = 3
        since_message_list = {'Messages': messages[3:]}
        since_message_arg = json.dumps({"Id": 3})
        self.assertEqual(since_message_list, json.loads(wp.chat_messages_since(since_message_arg)), 'Get messages since.')

if __name__ == '__main__':
    unittest.main()
