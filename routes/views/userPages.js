const express = require("express");
const { verifyToken } = require("../../middlewares/authMiddleware");
const authorizeRoles = require("../../middlewares/roleMiddleware");
const { addSector, addUser, viewUsers, approveBlogs, manageBlogs, createBlogs, profile, myBlogs, blogPage, editUser, editBlog } = require("../../controllers/views/userPageController");

const router = express.Router();

router.get("/add-sector", verifyToken, authorizeRoles(["superadmin"]), addSector)
router.get("/add-user",verifyToken, authorizeRoles(["superadmin","admin"]), addUser)
router.get("/view-users",verifyToken, authorizeRoles(["superadmin","admin"]), viewUsers)
router.get("/edit-user/:id",verifyToken, authorizeRoles(["superadmin","admin"]), editUser)
router.get("/approve-blogs", verifyToken, authorizeRoles(["superadmin","admin"]), approveBlogs)
router.get("/manage-blogs", verifyToken, authorizeRoles(["superadmin","admin"]), manageBlogs)
router.get("/create-blog", verifyToken, createBlogs)
router.get("/edit-blog/:id", verifyToken, editBlog)
router.get("/profile", verifyToken, profile)
router.get("/my-blogs", verifyToken, myBlogs)
router.get("/blog/:id", blogPage)

module.exports = router;