const { use } = require("../app");
const Bid = require("../models/bid");
const Item = require("../models/item");
const { validationResult } = require("express-validator");
const User = require("../models/user");
const Notification = require("../models/notification");
const io = require("../../index").io;

exports.getBids = async (req, res) => {
  const { itemId } = req.params;
  console.log("itemId", itemId);
  try {
    const bids = await Bid.findAll({
      where: { item_id: itemId },
      include: [
        {
          model: User,
          attributes: ["id", "username", "email"],
        },
      ],
    });
    console.log("bids", bids);
    res.status(200).json({ bids });
  } catch (error) {
    res.status(500).json({ message: "Error caught", error: error.message });
  }
};

exports.createBid = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { itemId } = req.params;
  const { bid_amount } = req.body;
  console.log(itemId);

  try {
    const item = await Item.findByPk(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    console.log("item", item);
    if (item.userId === req.userId) {
      return res
        .status(400)
        .json({ message: "You cannot bid on your own item" });
    }
    console.log("user date" + item.end_time, "current datee", new Date());

    if (item.end_time < new Date()) {
      return res.status(400).json({ error: "Auction has ended" });
      // add the status to the item to the end time
    }

    if (bid_amount <= item.current_price) {
      return res
        .status(400)
        .json({ message: "Bid amount must be higher than the current price" });
    }
    try {
      const bid = await Bid.create({
        user_id: req.userId,
        item_id: itemId,
        bid_amount,
      });

      item.current_price = bid_amount;
      await item.save();

      // // Emit the event
      // io.emit("update", { itemId, bidAmount: bid_amount, userId: req.userId });

      const notification = await Notification.create({
        user_id: req.userId,
        message: `A new bid of ${bid_amount} has been placed on your item ${item.name}`,
      });

 
      res.status(201).json({ message: "Bid placed successfully", bid });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteBid = async (req, res) => {
  const { id } = req.params;
  console.log("id", id);
  try {
    const bid = await Bid.findByPk(id);
    if (!bid) {
      return res.status(404).json({ message: "Bid not found" });
    }

    await bid.destroy();
    res.status(200).json({ message: "Bid deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
