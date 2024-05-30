const Item = require("../models/item");
const Notification = require("../models/notification");

exports.handleSocket = (socket, io) => {
  socket.on("bid", async ({ itemId, bidAmount, userId }) => {
    console.log("bid", itemId, bidAmount, userId);
    console.log("bid", itemId, bidAmount, userId);
    try {
      const item = await Item.findByPk(itemId);
      if (bidAmount > item.current_price) {
        item.current_price = bidAmount;
        await item.save();

        const notification = await Notification.create({
          userId: item.userId,
          message: `Your item "${item.name}" received a new bid of $${bidAmount}.`,
        });

        io.emit("update", { itemId, bidAmount, userId });
      } else {
        socket.emit("error", {
          message: "Bid amount must be higher than the current price",
        });
      }
    } catch (error) {
      socket.emit("error", { message: "An error occurred" });
    }
  });

  socket.on("notify", ({ userId, message }) => {
    io.to(userId).emit("notification", { message });
  });
};
