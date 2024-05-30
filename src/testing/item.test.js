const request = require("supertest");
const app = require("../app");
// const syncDB = require('../setupTestDB');
const sequelize = require("../config/database");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
// const config = require('../config/config'); // Adjust the path to your config

let token;

beforeAll(async () => {
    sequelize
    .sync()
    .then(() => {
      console.log("Database synchronized");
    })
    .catch((err) => {
      console.error("Error synchronizing the database:", err.message);
    });
  const user =  User.create({
    username: "testuser",
    email: "itemtestuser@example.com",
    password: "password123",
  }).then((user) => {
    console.log("User created:", user.id);
  }).catch((err) => {
    console.error("Error creating user:", err.message);
    });

  token = jwt.sign({ userId: user.id, role: "user" }, process.env.JWT_SECRET);

  console.log("line 22 item.test.js" + token);
});

afterAll(async () => {
  await sequelize.close();
});

describe("Item Endpoints", () => {
  sequelize
    .sync()
    .then(() => {
      console.log("Database synchronized");
    })
    .catch((err) => {
      console.error("Error synchronizing the database:", err.message);
    });
  it("should create a new item", async () => {
    const res = await request(app)
      .post("/items/")
      .set("Authorization", `${token}`)
      .send({
        name: "Test Item",
        description: "This is a test item.",
        starting_price: 10,
        end_time: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("item");
  });

  it("should get an item by ID", async () => {
    const newItemRes = await request(app)
      .post("/items/")
      .set("Authorization", `${token}`)
      .send({
        name: "Test Item",
        description: "This is a test item.",
        starting_price: 10,
        end_time: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
      });

    const newItemId = newItemRes.body.item.id;

    const res = await request(app)
      .get(`/items/${newItemId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("item");
  });

  it("should update an item", async () => {
    const newItemRes = await request(app)
      .post("/items/")
      .set("Authorization", `${token}`)
      .send({
        name: "Test Item",
        description: "This is a test item.",
        starting_price: 10,
        end_time: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
      });

    const newItemId = newItemRes.body.item?.id;

    const res = await request(app)
      .put(`/items/${newItemId}`)
      .set("Authorization", `${token}`)
      .send({
        name: "Updated Test Item",
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.item.name).toEqual("Updated Test Item");
  });

  it("should return 404 if item not found", async () => {
    const res = await request(app)
      .put("/items/999")
      .set("Authorization", `${token}`)
      .send({
        name: "Updated Test Item",
      });
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("message", "Item not found");
  });

  it("should delete an item", async () => {
    const newItemRes = await request(app)
      .post("/items/")
      .set("Authorization", `${token}`)
      .send({
        name: "Test Item 7",
        description: "This is a test item. 7",
        starting_price: 10,
        end_time: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
      });
    console.log(newItemRes.body);
    const newItemId = newItemRes.body.item.id;

    const res = await request(app)
      .delete(`/items/${newItemId}`)
      .set("Authorization", `${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message", "Item deleted successfully");
  });

  it("should return 404 if item not found when deleting", async () => {
    const res = await request(app)
      .delete("/items/999")
      .set("Authorization", `${token}`);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("message", "Item not found");
  });
});
