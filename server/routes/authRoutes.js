const express = require("express");

const { registerUser, loginUser } = require("../controllers/authController");
const {protect}=require("../middleware/authmiddleware")

const router = express.Router();

router.post("/register", registerUser);
router.post("/login",loginUser)

router.get("/profile", protect, (req, res) => { //what bascally it t check the user id and verify the token → check authentication Before route runs

  res.json({
    message: "Profile accessed",
    user: req.user,
  });
});

module.exports = router;