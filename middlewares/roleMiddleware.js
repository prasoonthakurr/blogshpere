const authorizeRoles = (allowedRoles) => {
    return (req,res,next) => {
        if(!allowedRoles.includes(req.user.role)){
            return res.redirect("/")
        }
        next();
    }
}

module.exports = authorizeRoles