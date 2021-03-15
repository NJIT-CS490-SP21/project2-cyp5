"""
Mocked Tests
"""
import unittest
import unittest.mock as mock
from unittest.mock import patch

import os
import sys

sys.path.append(os.path.abspath("../../"))
from app import adding_new_user

import models

KEY_INPUT = "input"
KEY_EXPECTED = "expected"

INITIAL_USERNAME = "user1"


class UpdateUserTestCase(unittest.TestCase):
    def setUp(self):
        self.success_test_params = [
            {
                KEY_INPUT: "TestUser1",
                KEY_EXPECTED: [INITIAL_USERNAME, "TestUser1"]
            },
            {
                KEY_INPUT: "TestUser2",
                KEY_EXPECTED: [INITIAL_USERNAME, "TestUser1", "TestUser2"],
            },
            {
                KEY_INPUT:
                "TestUser3",
                KEY_EXPECTED:
                [INITIAL_USERNAME, "TestUser1", "TestUser2", "TestUser3"],
            },
        ]

        initial_person = models.Person(username=INITIAL_USERNAME)
        self.initial_DB_mock = [initial_person]

    def mocked_DB_session_add(self, username):
        self.initial_DB_mock.append(username)

    def mocked_DB_session_commit(self):
        pass

    def mocked_person_query_all(self):
        return self.initial_DB_mock

    def test_success(self):
        for test in self.success_test_params:
            with patch("app.DB.session.add", self.mocked_DB_session_add):
                with patch("app.DB.session.commit",
                           self.mocked_DB_session_commit):
                    with patch("models.Person.query") as mocked_query:
                        mocked_query.all = self.mocked_person_query_all

                        actual_result = adding_new_user(test[KEY_INPUT])
                        expected_result = test[KEY_EXPECTED]

                    self.assertEqual(len(actual_result), len(expected_result))
                    self.assertEqual(actual_result[1], expected_result[1])


if __name__ == "__main__":
    unittest.main()
