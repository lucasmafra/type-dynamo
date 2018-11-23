Feature: Update
  The update() API allows you to update items into the database

  Background:
    Given a table "UserTable" with partition key "id"
    And the following items are saved on table "UserTable":
      | id | name      |
      | 1  | Mr. White |

  Scenario: Updating a user in a single parameter
    When I call User.update(user) with the following user:
      | id | name       |
      | 1  | Heisenberg |
    Then the table "UserTable" should contain the following:
      | id | name       |
      | 1  | Heisenberg |

  Scenario: Updating a user passing id on first parameter
  and attributes to update on second parameter
    When I call User.update(id, attributes) with the following user:
      | id | name       |
      | 1  | Heisenberg |
    Then the table "UserTable" should contain the following:
      | id | name       |
      | 1  | Heisenberg |