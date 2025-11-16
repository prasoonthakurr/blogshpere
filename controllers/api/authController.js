const users = require("../../models/userModel");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
    try{
        const {email, password} = req.body;
    
        const user = await users.findOne({
            where: {email: email},
        });
    
        if(!user){
            return res.redirect('/auth/login?error=Email+Not+Found');
        }
    
        const isMatch = await bcrypt.compare(password, user.password);
    
        if(!isMatch){
            return res.redirect('/auth/login?error=Incorrect+Password');
        }
    
        const token = jwt.sign({
            id : user.id,
            role: user.role,
        }, process.env.JWT_SECRET, {expiresIn: "7d"});

        res.cookie("token",token,{
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.redirect("/");

    } catch(err){
        res.status(500).json({"message" : "something went wrong"});
    }
}

const logout = (req,res) => {
    res.clearCookie("token");
    res.redirect("/");
}

module.exports = {
    login,
    logout,
}