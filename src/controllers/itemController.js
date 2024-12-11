const Item = require("../models/item");
const { validationResult } = require("express-validator");

const User = require("../models/user");

exports.getItems = async (req, res) => {
  const { page = 1, limit = 5 , status} = req.query;

  try {
    const items = await Item.findAll({
      where : status ? {status} : null,
      offset: (page - 1) * limit,
      limit: parseInt(limit),
      include: [
        {
          model: User,
          attributes: ["id", "username", "email"],
        },
      ],
    });

    res.status(200).json({ items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getItem = async (req, res) => {
  const { id } = req.params;

  try {
    const item = await Item.findByPk(id,  {
      include: [
        {
          model: User,
          attributes: ["id", "username", "email"],
        },
      ],
    });
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ item });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createItem = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, starting_price, end_time } = req.body;
  console.log(req.file, req.body);

  try {
    const item = await Item.create(
      {
        userId: req.userId,
        name,
        description,
        starting_price,
        current_price: starting_price,
        image_url: req.file ? req.file.path : null,
        end_time,
      },
      {
        include: [User], // assuming User is your User model
      }
    );

    res.status(201).json({ message: "Item created successfully", item });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateItem = async (req, res) => {
  const { id } = req.params;
  const { name, description, starting_price, end_time } = req.body;

  try {
    const item = await Item.findByPk(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    item.name = name || item.name;
    item.description = description || item.description;
    item.starting_price = starting_price || item.starting_price;
    item.end_time = end_time || item.end_time;
    item.image_url = req.file ? req.file.path : item.image_url;
    item.status = req.body.status || item.status;
    
    await item.save();
    res.status(200).json({ message: "Item updated successfully", item });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteItem = async (req, res) => {
  const { id } = req.params;

  try {
    const item = await Item.findByPk(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    await item.destroy();
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
