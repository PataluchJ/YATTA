import json
import unittest
import wrapper

wp = wrapper.Wrapper()

class TestWrapper(unittest.TestCase):

    ''' Tests require working database with test records.'''

    # Message tests

    def test_commands(self):
        r = wp.chat_command_exec({'User':'Test', 'Character':'Test', 'Command':'/roll 1d1', 'Room':'None'})
        self.assertEqual('FAIL Rolled:1', r['Text'])

if __name__ == '__main__':
    unittest.main()
