const request = require("supertest");
const app = require("../app");
const sequelize = require("../config/database");
const Bid = require("../models/bid");
const Item = require("../models/item");
const User = require("../models/user");
const Notification = require("../models/notification");

beforeAll(async () => {
  await sequelize.sync({ force: true });
  console.log("Database synchronized");
});

afterAll(async () => {
    
  await sequelize.close();
});

describe("Bid Endpoints", () => {
  let token;
  let itemId;
  let userId;

  beforeAll(async () => {
    const userRes = await request(app).post("/users/register").send({
      username: "testuser_bid_test",
      email: "testuser_bid_test@example.com",
      password: "password123",
      role: "user",
    });

    const loginRes = await request(app).post("/users/login").send({
      email: "testuser_bid_test@example.com",
      password: "password123",
    });
    console.log("loginRes", loginRes.body);
    userId = loginRes.body.user.id;
    token = loginRes.body.token;

    const itemRes = await Item.create({
      name: "Test Item",
      description: "This is a test item",
      starting_price: 100,
      current_price: 100,
      end_time: new Date(Date.now() + 1000 * 60 * 60), // 1 hour from now
      userId,
    });
    console.log("itemRes", itemRes);
    console.log("itemRes.id", itemRes.id);
    itemId = itemRes.id;
  });

  it("should get all bids for an item", async () => {
    const res = await request(app)
      .get(`/bids/${itemId}/bids`)
      .set("Authorization", `${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("bids");
  });

  it("should create a new bid", async () => {
    request(app)
      .post(`/bids/${itemId}/bids`)
      .set("Authorization", `${token}`)
      .send({
        bid_amount: 150,
      })
      .then((res) => {
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty("message", "Bid placed successfully");
        expect(res.body.bid).toHaveProperty("id");
        expect(res.body.bid).toHaveProperty("user_id", userId);
        expect(res.body.bid).toHaveProperty("item_id", itemId);
        expect(res.body.bid).toHaveProperty("bid_amount", 150);
      })
      .catch((err) => {
        console.error("Error creating bid:", err.message);
      });
  });

  it("should return an error if bid amount is less than or equal to current price", async () => {
    const res = await request(app)
      .post(`/bids/${itemId}/bids`)
      .set("Authorization", `${token}`)
      .send({
        bid_amount: 100,
      });

    expect(res.statusCode).toEqual(400);
  });

  it("should delete a bid", async () => {
    const bid = await Bid.create({
      user_id: userId,
      item_id: itemId,
      bid_amount: 200,
    });

    const res = await request(app)
      .delete(`/bids/${itemId}/bids/${bid.id}`)
      .set("Authorization", `${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message", "Bid deleted successfully");
  });

  it("should return an error if bid not found", async () => {
    const res = await request(app)
      .delete(`/bids/${itemId}/bids/1000`)
      .set("Authorization", `${token}`);

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("message", "Bid not found");
  });
});
