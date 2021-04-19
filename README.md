[![Coverage Status](https://coveralls.io/repos/github/Extremophile-ai/TalentQl-Rest-API/badge.svg?branch=staging)](https://coveralls.io/github/Extremophile-ai/TalentQl-Rest-API?branch=staging)

# TalentQl-Rest-API-Test-Project

## To test this project locally:
- Make sure to have Git and Node.js installed on your computer
- Clone the project from this reposiory: `git+https://github.com/Extremophile-ai/TalentQl-Rest-API.git`
- `cd` into the project's folder and run `npm install` to install dependencies.
- Create a `.env` file see the env sample file. Fill this file by supplying information in the `.env.example` file.
- Run `npm run dev` to start the server in development environment.
- To run tests, `npm run test` runs the server's tests in a test environment.

## To mimic production environment
`npm run start` starts and builds the server in a production environment

## Documentation
- Postman Documentation can be found here: `https://www.getpostman.com/collections/fbc02477f84fde77b587`

## HTTP Requests
All API requests are made by sending a secure HTTPS request using one of the following methods:

- POST Creates a new resource.
- GET Gets a resource or list of resources.
- PATCH updates a resource.
- DELETE deletes a resource.
> For POST, the body of your request must be a JSON payload.

## HTTP Response Codes
Each response will be returned with one of the following HTTP status codes:
- 201 OK: Resource created successfully.
- 200 OK: Successful request.
- 400 Bad Request: There was a problem with the request.
- 404 Resource not found: Requested resource does not exist.
- 409 Conflict: There's an already existing resource.
- 500 Server Error: Server error.
