const Bid = require("../models/bid");
const Item = require("../models/item");
const Notification = require("../models/notification");

exports.handleSocket = (socket, io) => {
  socket.on("bid", async ({ itemId, bidAmount, userId }, callback) => {
    console.log("bid", itemId, bidAmount, userId);
    console.log(
      `Received bid: ${bidAmount} for item: ${itemId} from user: ${userId}`
    );

    try {
      const item = await Item.findByPk(itemId);
      if (!item) {
        // socket.emit("error", { message: "Item not found" });
        callback({ success: false, error: "Item not found" });
        return;
      }

      console.log("item", item.userId, " ==", "userid", userId);
      if (item.userId == userId) {
        // socket.emit("error", { message: "You cannot bid on your own item" });
        callback({ success: false, error: "You cannot bid on your own item" });

        return;
      }

      if (item.end_time < new Date()) {
        // socket.emit("error", { message: "Auction has ended" });
        callback({ success: false, error: "Auction has ended" });

        return;
      }

      if (bidAmount > item.current_price) {
        item.current_price = bidAmount;
        await item.save();
        io.emit("update", { itemId, bidAmount, userId });

        console.log(`New bid placed: ${bidAmount} for item: ${itemId}`);
        console.log("item object", item.userId);

        const bid = await Bid.create({
          item_id: itemId,
          user_id: userId,
          bid_amount: bidAmount,
        });

        await bid.save();

        const notification = await Notification.create({
          user_id: item.userId,
          message: `Your item "${item.name}" received a new bid of $${bidAmount}.`,
        });

        callback({ success: true, message: "Bid placed successfully" });
      } else {
        // socket.emit("error", {
        //   message: "Bid amount must be higher than the current price",
        // });
        // console.log(`Bid amount too low: ${bidAmount} for item: ${itemId}`);
        callback({
          success: false,
          error: "Bid amount must be higher than the current price",
        });
      }
    } catch (error) {
      // socket.emit("error", { message: "An error occurred" });
      callback({ success: false, error: "Error processing bid" });
    }
  });

  socket.on("notify", ({ userId, message }) => {
    console.log(
      `Sending notification to user: ${userId} with message: ${message}`
    );
    if (!userId || !message) {
      socket.emit("error", { message: "Invalid data" });
      return;
    } else {
      socket.emit("notification", { message });
    }
  });
};
