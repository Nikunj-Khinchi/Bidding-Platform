# Real-Time Bidding Platform API

## Description

This is a comprehensive RESTful API for a real-time bidding platform built with Node.js, Express, Socket.io, and PostgreSQL.

## Features

- User authentication and role-based access control
- Real-time bidding with WebSocket notifications
- Advanced CRUD operations for users, items, bids, and notifications
- Image upload functionality
- Search, filtering, and pagination for auction items
- Validation and error handling
- Unit and integration tests
- Containerization withDocker

## Installation

1. Clone the repository:

`git clone https://github.com/Nikunj-Khinchi/Bidding-Platform`
`cd Bidding-Platform`

2. Install dependencies:
   `npm install`

3.  MySql Setup

- To create a database and use it, you need to have access to a MySQL server. You can use a local server or a remote one. Here are the steps to create a database:

- Install MySQL server if you haven't already. You can download it from the official MySQL website.

* Open the MySQL command-line client or a GUI like MySQL Workbench.

- Log in with your MySQL root user credentials.

- Create a new database with the CREATE DATABASE command. For example, if you want to create a database named mydatabase, you would run:
  `CREATE DATABASE mydatabase;` ,
   `use mydatabase`

- Update your .env file with the database name, user, password, and host

3. Set up the environment variables in a `.env` file based on the provided `.env.example`

4. Start the server: `npm start`


## API Endpoints

The application provides the following routes:

- Users:
  - POST /users/register - Register a new user.
  - POST /users/login - Authenticate a user and return a token.
  - GET  /users/profile - Get the profile of the logged-in user.
  - POST /users/reset-password - Reset the password
- Items:
  - GET /items - Retrieve all auction items (with pagination).
  - GET /items/:id - Retrieve a single auction item by ID.
  - POST /items - Create a new auction item. (Authenticated users, image upload)
  - PUT /items/:id - Update an auction item by ID. (Authenticated users, only item owners or admins)
  - DELETE /items/:id - Delete an auction item by ID. (Authenticated users, only item owners or admins)
- Bids:
  - GET /items/:itemId/bids - Retrieve all bids for a specific item.
  - POST /items/:itemId/bids - Place a new bid on a specific item. (Authenticated users)
  - POST /:itemId/bids/:id  - Delete the bid based on id
- Notifications:
  - GET /notifications - Retrieve notifications for the logged-in user.
  - POST /notifications/mark-read - Mark notifications as read.

## Testing

To run the tests, use the command: `npm test filename`
- Untit Testing 
  - testing/auth.test.js : `npm test auth.test.js`
  - testing/bid.test.js :  `npm test bid.test.js`
  - testing/item.test.js :  `npm test item.test.js`

