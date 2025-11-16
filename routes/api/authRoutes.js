const express = require("express");
const { login, logout } = require("../../controllers/api/authController");

const router = express.Router();

router.post('/login', login);
router.get('/logout',logout);

module.exports = router;