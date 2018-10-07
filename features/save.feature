Feature: Save
  The save() API allows you to save items into the database

  Background:
    Given a table "UserTable" with partition key "id"

  Scenario: Saving a new user
    When I call User.save(user) with the following user:
      | id | name         |
      | 1  | Fausto Silva |
    Then the table "UserTable" should contain the following:
      | id | name         |
      | 1  | Fausto Silva |

  Scenario: Saving multiple users at once
    When I call User.save(users) with the following users:
      | id | name  |
      | 1  | Rick  |
      | 2  | Morty |
      | 3  | Jerry |
    Then the table "UserTable" should contain the following:
      | id | name  |
      | 1  | Rick  |
      | 2  | Morty |
      | 3  | Jerry |