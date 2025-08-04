# CodeSoar

# Node version
    - 22.13.0

# Database
    - Postgres

# For Security
    - I have used JWT Authentication and redis to store the JWT Token.

# For Signup
    - http://localhost:3000/auth/signup
    - Name (required), password (required), email (optional)
    - example :- {
                    "name": "Aman Kumar Gupta",
                    "phoneNumber": "9876343210",
                    "password": "123"
                 }

# For Login
    - http://localhost:3000/auth/login
    - Phone Number (required), Password (required).
    - either use default acccounts listed in seeder, password is 123 for all or signup first.
    - exapmle:- {
                    "phoneNumber": "9988776655",
                    "password": "123"
                }

# To Delete Account
    - User can only delete its own account.
    - need to be logged in.

# To Update Account
    - need to be logged in.
    - need to provide all details, name, password, phoneNumber, email (optional)

# Search
    - http://localhost:3000/search
    - example:- 1.  {
                        "search": "ash"
                    }
                2.  {
                        "search": "9876543210"
                    }
    - either use phone number or name for searching...

# Mark Spam
    - http://localhost:3000/spam
    - need to provide to mark spam
    - expamle:- {
                    "number": "6784321987"
                }

# Show Details on click
    - http://localhost:3000/show-details
    - can priovide either user registered phone number or nameId
    - need to handle this in frontend to provide nameId.
    - expamle:- {
                    "nameId": "6"
                }

                {
                    "number": "9876543210"
                }