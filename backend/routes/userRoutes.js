const express = require("express");
const { registerUser, authUser, checkAuth } = require("../controllers/userControllers");

const router = express.Router();

router.post("/sign-up", registerUser);
router.post("/sign-in", authUser);
router.get("/check-auth", checkAuth);

module.exports = router;
