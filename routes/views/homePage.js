const express = require("express");
const getHomePage = require("../../controllers/views/homePageController");

const router = express.Router();

router.get("/", getHomePage);

module.exports = router