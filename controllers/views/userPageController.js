const users = require("../../models/userModel");
const blogs = require("../../models/blogModel");
const sectors = require("../../models/sectorModel");

const addSector = async (req,res) => {
    const allSectors = await sectors.findAll();
    return res.render("add-sector", { sectors : allSectors });
}

const addUser = async (req,res) => {
    const allSectors = await sectors.findAll();
    return res.render("add-user", { sectors : allSectors });
}

const editUser = async (req, res) => {
    const { id } = req.params;
    const user = await users.findOne({
        where: { id: id },
    });
    const allSectors = await sectors.findAll();
    if((req.user.role === 'admin' && user.role === 'user') || 
    (req.user.role === 'superadmin' && (user.role === 'admin' || user.role === 'user'))){
        return res.render("edit-user",{ currUser: req.user, editUser: user, sectors: allSectors });
    }
    return res.redirect('/user/view-users');
}

const viewUsers = async (req,res) => {
    const allUsers = await users.findAll();
    return res.render("view-users", { users: allUsers });
}

const approveBlogs = async (req,res) => {
    let allblogs;
    if(req.user.role === 'admin'){

        const userSectors = await users.findOne({
            where: { id : req.user.id },
            attributes: ['sector'],
        })

        const sectorRecords = await sectors.findAll({
            where: { id: userSectors.sector },
            attributes: ['name']
        });

        const sectorNames = sectorRecords.map(sector => sector.name);

        allblogs = await blogs.findAll({
            where: { 
                isApproved: false,
                isRejected: false,
                isPrivate: false,
                sector: sectorNames
            },
            include: {
            model: users,
            as:'author',
            attributes: ['name'],
        }
        });
    }
    else{
        allblogs = await blogs.findAll({
        where: { 
            isApproved: false,
            isRejected: false,
            isPrivate: false,
        },
        include: {
            model: users,
            as:'author',
            attributes: ['name'],
        }
    });
    }
    return res.render("approve-blogs", { blogs: allblogs });
}

const manageBlogs = async (req, res) => {
    let allblogs;
    if(req.user.role === 'admin'){

        const userSectors = await users.findOne({
            where: { id : req.user.id },
            attributes: ['sector'],
        })

        const sectorRecords = await sectors.findAll({
            where: { id: userSectors.sector },
            attributes: ['name']
        });

        const sectorNames = sectorRecords.map(sector => sector.name);

        allblogs = await blogs.findAll({
            where: {
                isApproved: true,
                isPrivate: false,
                sector: sectorNames
            },
            include: {
                model: users,
                as:'author',
                attributes: ['name'],
            },
        });
    }
    else{
        allblogs = await blogs.findAll({
            where: { 
                isApproved: true,
                isPrivate: false,
            },
            include: {
                model: users,
                as:'author',
                attributes: ['name'],
            },
        });
    }
    return res.render("manage-blogs", { blogs : allblogs });
}

const createBlogs = async (req,res) => {
    let allSectors
    if(req.user.role == "admin"){
        const user = await users.findOne({
            where: { id : req.user.id }
        });
        const sectorIds = Array.isArray(user.sector) ? user.sector.map(id => parseInt(id)) : [];
        allSectors = await sectors.findAll({
            where: { id: sectorIds },
        });
    }
    else allSectors = await sectors.findAll();
    return res.render("create-blog", {sectors : allSectors});
}

const editBlog = async (req, res) => {
    try{
        const { id } = req.params;
        const blog = await blogs.findOne({
            where: { id: id },
        });
        if(!blog){
            return res.status(404).json({"message": "Blog not found"});
        }

        if (blog.authorId !== req.user.id) {
            return res.redirect("/user/my-blogs");
        }

        let allSectors
        if(req.user.role == "admin"){
            const user = await users.findOne({
                where: { id : req.user.id }
            });
            const sectorIds = Array.isArray(user.sector) ? user.sector.map(id => parseInt(id)) : [];
            allSectors = await sectors.findAll({
                where: { id: sectorIds },
            });
        }
        else allSectors = await sectors.findAll();

        return res.render("edit-blog", { blog, sectors: allSectors });
    } catch(err){
        res.status(500).json({"message":"error rendering Edit Blog Page"});
    }
}

const profile = async (req,res) => {
    const user = await users.findOne({
        where: { id: req.user.id },
    })
    if(req.user.role === 'admin'){

        const userSectors = await users.findOne({
            where: { id : req.user.id },
            attributes: ['sector'],
        })

        const sectorRecords = await sectors.findAll({
            where: { id: userSectors.sector },
            attributes: ['name']
        });

        user.sectorNames = sectorRecords.map(sector => sector.name);
    }
    return res.render("profile", { user : user });
}

const myBlogs = async (req, res) => {
    const AllMyBlogs = await blogs.findAll({
        where: { authorId : req.user.id },
        order: [['createdAt', 'DESC']],
    })
    const name = await users.findOne({
        where: { id : req.user.id },
        attributes: ['name'],
    })
    const authorName = name?.name;
    return res.render("my-blogs", { blogs : AllMyBlogs, authorName: authorName });
}

const blogPage = async (req, res) => {
    const id = parseInt(req.params.id);
    const blog = await blogs.findOne({
        where: { id : id},
    });
    const author = await users.findOne({
        where: { id : blog.authorId },
        attributes: ["name"],
    });

    const authorName = author.name;

    if((blog.isApproved && !blog.isPrivate ) || ( req.user && req.user.id == blog.authorId)){
        return res.render("blog-page", { blog : blog, authorName });
    }

    if(req.user && req.user.role === "superadmin"){
        return res.render("blog-page", { blog : blog, authorName });
    }
    else if(req.user && req.user.role == "admin"){
        const sectorId = await sectors.findOne({
            where: { name : blog.sector },
            attributes: ['id'],
        });
        const adminSectors = await users.findOne({
            where: { id : req.user.id },
            attributes: ['sector'],
        });
        if(adminSectors.sector.includes(sectorId.id)){
            return res.render("blog-page", { blog : blog, authorName });
        }
        else{
            return res.redirect("/")
        }
    }
    else{
        return res.redirect("/")
    }

}

module.exports = {
    addSector,
    addUser,
    viewUsers,
    approveBlogs,
    manageBlogs,
    createBlogs,
    profile,
    myBlogs,
    blogPage,
    editUser,
    editBlog,
};