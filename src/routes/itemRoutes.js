const express = require("express");
const { check } = require("express-validator");
const {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
} = require("../controllers/itemController");
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");
const { createRateLimiter } = require("../middleware/rateLimitMiddleware");
// const upload = multer({ dest: 'uploads/' });

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
    cb(null, `${formattedDate}-${'UserId-'+req.userId}-${file.originalname}`);
  },
});


const upload = multer({ storage: storage });


// Apply rate limiting middleware
const itemCreationLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit to 10 requests per windowMs for bid creation
  message: { error: "Too many bid creation attempts, please try again later." },
});


router.get("/", getItems);
router.get("/:id", getItem);
router.post(
  "/",
  itemCreationLimiter,
  authMiddleware,
  upload.single("file"),
  [
    check("name").not().isEmpty(),
    check("description").not().isEmpty(),
    check("starting_price").isDecimal(),
    check("end_time").not().isEmpty(),
  ],
  createItem
);
router.put("/:id", authMiddleware, upload.single("file") ,updateItem);
router.delete("/:id", authMiddleware, deleteItem);

module.exports = router;
