const express = require("express");
const { getLoginPage } = require("../../controllers/views/authPageController")

const router = express.Router();

router.get('/login', getLoginPage);

module.exports = router;