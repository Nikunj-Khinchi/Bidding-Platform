# Real-Time Bidding Platform API

## Description

This is a comprehensive RESTful API for a real-time bidding platform built with Node.js, Express, Socket.io, and MYSQL.

## Features

- User authentication and role-based access control
- Real-time bidding with WebSocket notifications
- Advanced CRUD operations for users, items, bids, and notifications
- Image upload functionality
- Search, filtering, and pagination for auction items
- Validation and error handling
- Unit and integration tests
- Containerization with Docker

## Code Quality

This project uses [ESLint](https://eslint.org/) to maintain code quality and consistency. To run ESLint, use the following command: `npx eslint`

## Installation

1. Clone the repository:

- `git clone https://github.com/Nikunj-Khinchi/Bidding-Platform`
- `cd Bidding-Platform`

2. Install dependencies:
   `npm install`

3. MySql Setup

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
  - GET /users/profile - Get the profile of the logged-in user.
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
  - POST /:itemId/bids/:id - Delete the bid based on id
- Notifications:
  - GET /notifications - Retrieve notifications for the logged-in user.
  - POST /notifications/mark-read - Mark notifications as read.

## Testing

To run the tests, use the command: `npm test filename`

- Untit Testing
  - testing/auth.test.js : `npm test auth.test.js`
  - testing/bid.test.js : `npm test bid.test.js`
  - testing/item.test.js : `npm test item.test.js`

<hr>

# Sequelize Migration Approaches

This document explains two approaches for handling database migrations in Sequelize: using `sequelize.sync({ alter: true })` for automatic synchronization and `sequelize-cli` for manual migrations.

---

## **Approach 1: sequelize.sync({ alter: true })**

### **Overview**

`sequelize.sync({ alter: true })` is a method provided by Sequelize to automatically synchronize the database schema with your model definitions. It detects differences between the database schema and your Sequelize models and applies the necessary changes.

### **Usage**

Here’s how to use it:

```javascript
const { sequelize } = require("./models");

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database schema synchronized successfully.");
  })
  .catch((err) => {
    console.error("Error synchronizing database schema:", err);
  });
```

## **Approach 2: sequelize-cli for Migrations**

### **Overview**

`sequelize-cli` is a command-line tool for managing migrations in Sequelize. Migrations provide a structured and version-controlled way to update the database schema.

### **Setup**

1. Install `sequelize-cli`:

   ```bash
   npm install sequelize-cli --save-dev
   ```

2. Initialize Sequelize project structure:

   ```bash
   npx sequelize-cli init
   ```

   This creates the following directories:

   - `models/`: Store your Sequelize models.
   - `migrations/`: Store migration files.
   - `config/`: Store database configuration.

3. Update `config/config.json` with your database credentials.

---

### **Generate and Run Migrations**

1. **Generate a Migration File**

   ```bash
   npx sequelize-cli migration:generate --name add-isDeleted-to-notifications
   ```

   This creates a new migration file in the `migrations/` folder.

2. **Edit the Migration File**
   Open the generated file and define the changes:

   ```javascript
   module.exports = {
     async up(queryInterface, Sequelize) {
       await queryInterface.addColumn("Notifications", "isDeleted", {
         type: Sequelize.BOOLEAN,
         defaultValue: false,
       });
     },

     async down(queryInterface, Sequelize) {
       await queryInterface.removeColumn("Notifications", "isDeleted");
     },
   };
   ```

3. **Run the Migration**
   Apply the migration to the database:

   ```bash
   npx sequelize-cli db:migrate
   ```

4. **Rollback a Migration**
   Undo the last applied migration:
   ```bash
   npx sequelize-cli db:migrate:undo
   ```
