const express = require("express");
const { verifyToken } = require("../../middlewares/authMiddleware");
const authorizeRoles = require("../../middlewares/roleMiddleware");
const upload = require("../../util/multer");
const { addSector, addUser, deleteUser, editUser, approveBlog, rejectBlog, createBlogs, editBlog, deleteBlog  } = require("../../controllers/api/userController");

const router = express.Router();

router.post("/add-user", verifyToken, authorizeRoles(["superadmin","admin"]), upload.single('avatar'), addUser)
router.post("/edit-user/:id", verifyToken, authorizeRoles(["superadmin","admin"]), upload.single('imageFile'), editUser)
router.post("/delete-user", verifyToken, authorizeRoles(["superadmin","admin"]), deleteUser)
router.post("/add-sector", verifyToken, authorizeRoles(["superadmin"]), addSector)
router.post("/create-blog", verifyToken, upload.single('imageFile'), createBlogs)
router.post("/approve-blog/:id", verifyToken, authorizeRoles(["superadmin","admin"]), approveBlog)
router.post("/reject-blog/:id", verifyToken, authorizeRoles(["superadmin","admin"]), rejectBlog)
router.post("/edit-blog/:id", verifyToken, upload.single('imageFile'), editBlog)
router.post("/delete-blog/:id", verifyToken, deleteBlog)

module.exports = router;