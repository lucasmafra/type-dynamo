Feature: Index
  Indexes give you access to alternate query patterns, and can speed up queries.

  Background:
    Given a table "StudentClassTable" with partition key "student" and sort key "class" and an index "classIndex" on table "StudentClassTable" with partition key "class" and sort key "student"
    And the following items are saved on table "StudentClassTable":
      | student | class   |
      | Rick    | Science |
      | Rick    | Math    |
      | Morty   | Physics |
      | Morty   | Math    |

  Scenario Outline: Getting students from a specific class
    When I call StudentClass.onIndex.classIndex.find({ class: '<class>' }).withAttributes(['student']).execute()
    Then I should get the <students> from that class:

    Examples:
      | class   | students    |
      | Science | Rick        |
      | Math    | Morty, Rick |
      | Physics | Morty       |