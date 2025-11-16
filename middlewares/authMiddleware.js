const jwt = require('jsonwebtoken');

const verifyToken = (req,res,next) => {
    try{
        const token = req.cookies.token;
        if(!token){
            return res.redirect("/");
        }
        try{
            const user = jwt.verify(token, process.env.JWT_SECRET);
            req.user = user;
            next();
        } catch(err){
            res.clearCookie("token");
            return res.redirect("/");
        }
    } catch(err){
        return res.redirect("/");
    }

}

const localUser = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (err) {
      req.user = null;
    }
  } else {
    req.user = null;
  }
  res.locals.user = req.user;
  next();
}

module.exports ={
    verifyToken,
    localUser,
}