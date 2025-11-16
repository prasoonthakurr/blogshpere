const sectors = require("../../models/sectorModel");
const blogs = require("../../models/blogModel");
const users = require("../../models/userModel");
const bcrypt = require("bcrypt");

const addSector = async (req, res) => {
  try {
    const { sectorName } = req.body;
    await sectors.findOrCreate({
      where: { name: sectorName },
      defaults: {
        name: sectorName,
      },
    });
    return res.redirect("/user/add-sector");
  } catch (err) {
    return res.status(500).json({ message: "Error creating a sector" });
  }
}

const addUser = async (req, res) => {
  try {
    const { name, email, password, role, imageUrl } = req.body;
    const user = await users.findOne({
      where: { email: email },
    });
    if (user) return res.status(409).json({ message: "User Already exists" });
    let { sectors } = req.body;
    const avatar = req.file
      ? "/uploads/" + req.file.filename
      : imageUrl
      ? imageUrl
      : null;
    const hashedPassword = await bcrypt.hash(password, 10);
    if (!Array.isArray(sectors)) {
      sectors = sectors ? [sectors] : [];
    }
    sectors = sectors.map((id) => parseInt(id));
    await users.findOrCreate({
      where: { email: email },
      defaults: {
        name,
        email,
        password: hashedPassword,
        role,
        avatar,
        sector: sectors,
        createdBy: req.user.id,
      },
    });
    return res.redirect("/user/view-users");
  } catch (err) {
    return res.status(500).json({ message: "Error creating a user" });
  }
}

const editUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role, imageUrl } = req.body;

    const existingUser = await users.findOne({ where: {id: id}});
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    let { sectors } = req.body;
    if (!Array.isArray(sectors)) {
      sectors = sectors ? [sectors] : [];
    }
    sectors = sectors.map((id) => parseInt(id));

    const avatar = req.file ? "/uploads/" + req.file.filename : imageUrl || existingUser.avatar;

    let hashedPassword = existingUser.password;
    if (password && password.trim() !== "") {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    await existingUser.update({
      name: name || existingUser.name,
      email: email || existingUser.email,
      password: hashedPassword,
      role: role || existingUser.role,
      avatar: avatar,
      sector: sectors,
      updatedBy: req.user.id,
    });

    return res.redirect("/user/view-users");
  } catch (err) {
    return res.status(500).json({ message: "Error updating user" });
  }
}

const createBlogs = async (req, res) => {
  try {
    const { title, description, category, imageUrl, isPublic } = req.body;
    const imageFile = req.file ? req.file.filename : imageUrl ? imageUrl : null;
    const isApproved = req.user.role === "user" ? false : true;
    const approvedBy = req.user.role === "user" ? null : req.user.id; 
    const blog = await blogs.create({
      title: title,
      description: description,
      imageUrl: imageFile,
      sector: category,
      isPrivate: !isPublic,
      authorId: req.user.id,
      isApproved: isApproved,
      approvedBy: approvedBy,
    });
    return res.redirect(`/user/blog/${blog.id}`);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error creating a Blog" });
  }
}

const deleteUser = async (req, res) => {
  try {
    const { id } = req.body;
    const user = await users.findOne({
      where: { id: id },
    });
    if (user.role === "superadmin") {
      return res.redirect("/user/view-users");
    }
    if (
      req.user.role === "superadmin" ||
      (req.user.role === "admin" && user.role === "user")
    ) {
      await user.update({ deletedBy: req.user.id });
      await users.destroy({
        where: { id: id },
      });
    }
    return res.redirect("/user/view-users");
  } catch (err) {
    return res.status(500).json({ message: "Error deleting a user" });
  }
}

const approveBlog = async (req, res) => {
    try{
        const { id } = req.params;
        const blog = await blogs.findOne({
            where: { id: id },
        });
        if(!blog){
            return res.status(404).json({"Message" : "This is blog is either deleted or not created"});
        }

        const sectorId = await sectors.findOne({
            where: { name: blog.sector },
            attributes: ["id"],
        });
    
        const adminSectors = await users.findOne({
            where: { id : req.user.id },
            attributes: ["sector"],
        });

        if(req.user.role === "superadmin" || (req.user.role === "admin" && adminSectors.sector.includes(sectorId.id))){
            await blog.update({
                isApproved: true,
                approvedBy: req.user.id,
            });
        }
        return res.redirect("/user/approve-blogs");
    } catch(err){
        return res.status(500).json({ "message": "Error approving this blog" });
    }
}

const rejectBlog = async (req, res) => {
    try{
        const { id } = req.params;
        const blog = await blogs.findOne({
            where: { id: id },
        });
        if(!blog){
            return res.status(404).json({"Message" : "This is blog is either deleted or not created"});
        }

        const sectorId = await sectors.findOne({
            where: {name: blog.sector},
            attributes: ["id"],
        });
    
        const adminSectors = await users.findOne({
            where: { id : req.user.id },
            attributes: ["sector"],
        });
    
        if(req.user.role === "superadmin" || (req.user.role === "admin" && adminSectors.sector.includes(sectorId.id))){
            await blog.update({
                isRejected: true,
                rejectedBy: req.user.id,
            });
        }
        return res.redirect("/user/approve-blogs");
    } catch(err){
        return res.status(500).json({ "message": "Error rejecting this blog" });
    }
}

const editBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, imageUrl, isPublic } = req.body;

    const blog = await blogs.findOne({ where: { id: id } });
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.authorId !== req.user.id) {
      return res.status(403).json({ message: "You are not allowed to edit this blog" });
    }

    let updatedImage = blog.imageUrl;
    if(req.file){
      updatedImage = req.file.filename;
    } else if(imageUrl){
      updatedImage = imageUrl;
    }

    let isApproved = blog.isApproved;
    let approvedBy = blog.approvedBy;
    let isRejected = blog.isRejected;
    let rejectedBy = blog.rejectedBy;
    if(req.user.role === "user"){
      isApproved = false, isRejected = false;
      approvedBy = null, rejectedBy = null;
    }

    await blog.update({
      title: title,
      description: description,
      imageUrl: updatedImage,
      sector: category,
      isPrivate: !isPublic,
      isApproved: isApproved,
      approvedBy: approvedBy,
      isRejected: isRejected,
      rejectedBy: rejectedBy,
      updatedBy: req.user.id,
    });

    return res.redirect("/user/my-blogs");
  } catch(err){
    return res.status(500).json({ message: "Error editing the blog" });
  }
}

const deleteBlog = async (req, res) => {
    try{
        const { id } = req.params;
        const blog = await blogs.findOne({ where: { id: id } })
        if(!blog){
            return res.status(404).json({"Message": "Blog not found"});
        }
        if(req.user.role === "superadmin" || req.user.id === blog.authorId){
            await blog.update({ deletedBy: req.user.id });
            await blog.destroy({ where : { id: id }});
        } 
        else if(req.user.role === "admin"){
            const sectorId = await sectors.findOne({
                where: {name: blog.sector},
                attributes: ["id"],
            });
            const user = await users.findOne({
                where: { id : req.user.id },
                attributes: ["sector"],
            });
    
            const adminSectors = user.sector;
    
            if(adminSectors.includes(sectorId.id)){
                await blog.update({ deletedBy: req.user.id });
                await blog.destroy({ where : { id: id }});
            }
        }
        return res.redirect("/");
    } catch(err){
        res.status(500).json({"Message": "Error deleting this blog"});
    }
}

module.exports = {
  addSector,
  addUser,
  createBlogs,
  deleteUser,
  editUser,
  approveBlog,
  rejectBlog,
  editBlog,
  deleteBlog,
};
