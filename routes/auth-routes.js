const express = require("express");
const authMiddleware = require("../middleware/auth-middleware");
const router = express.Router();

const {
    registerUser,
    loginUser,
    changePasword,
} = require("../controllers/auth-controller");

//all routes are related to authentication & authorization
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/change-password", authMiddleware, changePasword);

module.exports = router;
