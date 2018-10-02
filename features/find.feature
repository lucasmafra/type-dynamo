Feature: Find
  The find() API allows you to retrieve items from the database.

  Background:
    Given a table "UserTable" with partition key "id"
    And the following items are saved on table "UserTable":
      | id | name    |
      | 1  | Fausto  |
      | 2  | Silva   |
      | 3  | Faustao |

  Scenario: Getting one specific user
    When I call User.find({ id: 1 }).execute()
    Then I should get the following item:
      | id | name   |
      | 1  | Fausto |

