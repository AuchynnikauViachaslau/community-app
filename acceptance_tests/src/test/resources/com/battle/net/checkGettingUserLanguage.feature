@API
Feature: Check getting user language

    Scenario: User can switch language
        Given User register to app first time
            | email             | password | name     | language |
            | testemail@mail.ru | 123456   | testuser | ru       |
        When User login to App
        Then User language is ru

