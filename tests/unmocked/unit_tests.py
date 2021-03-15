"""
This test checks the user input with the expected input Unmocked
"""
import unittest
import os
import sys

sys.path.append(os.path.abspath("../../"))
from functions import *

USER_INPUT = "username"
EXPECTED_OUTPUT = "expected"


class UpdateUserTestCase(unittest.TestCase):
    """This class is to check if an entered user is displayed
    correctly and displays none if nothing passed"""
    def setUp(self):
        self.success_test_params = [
            {
                USER_INPUT: {
                    'win': 'Chirag',
                    'lose': 'Raju'
                },
                EXPECTED_OUTPUT: [107, 93],
            },
            {
                USER_INPUT: {
                    'win': 'Raju',
                    'lose': 'Joe'
                },
                EXPECTED_OUTPUT: [92, 98],
            },
            {
                USER_INPUT: {
                    'win': 'Joe',
                    'lose': 'Chirag'
                },
                EXPECTED_OUTPUT: [97, 108],
            },
        ]

    def test_add_user(self):
        """This function tests the score update function tp see if scores are changing properly"""
        for test in self.success_test_params:
            actual_result = score_update(test[USER_INPUT])
            expected_result = test[EXPECTED_OUTPUT]
            self.assertGreater(actual_result[0], expected_result[0])
            self.assertLess(actual_result[1], expected_result[1])


if __name__ == "__main__":
    unittest.main()
