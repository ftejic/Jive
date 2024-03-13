const express = require("express");
const { registerUser } = require("../controllers/userControllers");

const router = express.Router();

router.post("/sign-up", registerUser);


module.exports = router;