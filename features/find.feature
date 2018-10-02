Feature: Find
  The find() API allows you to retrieve items from the database.

  Background:
    Given a table "UserTable" with partition key "id"
    And the following items are saved on table "UserTable":
      | id | name   |
      | 1  | Rick   |
      | 2  | Morty  |
      | 3  | Jerry  |

  Scenario: Getting one specific user
    When I call User.find({ id: 1 }).execute()
    Then I should get the following item:
      | id | name |
      | 1  | Rick |

  Scenario: Getting many specific users
    When I call User.find(ids).execute() with the following ids:
      | id |
      | 1  |
      | 2  |
    Then I should get the following items in any order:
      | id | name  |
      | 1  | Rick  |
      | 2  | Morty |

  Scenario: Getting users without specifying any key
    When I call User.find().allResults().execute()
    Then I should get the following items in any order:
      | id | name   |
      | 1  | Rick   |
      | 2  | Morty  |
      | 3  | Jerry  |
