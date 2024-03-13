const express = require("express");
const { registerUser, authUser } = require("../controllers/userControllers");

const router = express.Router();

router.post("/sign-up", registerUser);
router.post("/sign-in", authUser);

module.exports = router;
