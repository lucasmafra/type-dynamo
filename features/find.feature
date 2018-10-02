Feature: Find
  The find() API allows you to retrieve items from the database.

  Background:
    Given a table "UserTable" with partition key "id"
    And the following items are saved on table "UserTable":
      | id | name  |
      | 1  | Rick  |
      | 2  | Morty |
      | 3  | Jerry |
    And a table "OrderTable" with partition key "userId" and sort key "orderId"
    And the following items are saved on table "OrderTable":
      | userId | orderId | description   |
      | 1      | 1       | Neutrino bomb |
      | 1      | 2       | Shrink ray    |
      | 1      | 3       | Dark matter   |
      | 2      | 4       | Portal gun    |
      | 2      | 5       | Love Potion   |

  Scenario: Getting one specific user
    When I call User.find({ id: '1' }).execute()
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

  Scenario: Getting users without specifying any id
    When I call User.find().allResults().execute()
    Then I should get the following items in any order:
      | id | name  |
      | 1  | Rick  |
      | 2  | Morty |
      | 3  | Jerry |

  Scenario: Querying orders by user id
    When I call Order.find({ userId: '1' }).paginate().execute()
    Then I should get the following items:
      | userId | orderId | description   |
      | 1      | 1       | Neutrino bomb |
      | 1      | 2       | Shrink ray    |
      | 1      | 3       | Dark matter   |
