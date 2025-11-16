const blogs = require("../../models/blogModel");
const users = require("../../models/userModel");

users.hasMany(blogs, { foreignKey: "authorId", as: "blogs" });
blogs.belongsTo(users, { foreignKey: "authorId", as: "author" });

const getHomePage = async (req, res) => {
    const allBlogs = await blogs.findAll({
        where: { 
            isApproved: true,
            isPrivate: false,
        },
        include: {
            model: users,
            as:'author',
            attributes: ['name'],
        },
        order: [['createdAt', 'DESC']],
    });
    res.render("blogs", { blogs : allBlogs });
}

module.exports = getHomePage;