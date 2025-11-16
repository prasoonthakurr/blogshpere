const getLoginPage = (req,res) => {
    const error = req.query.error || null;
    res.render('login', {layout: false, error: error});
}

module.exports = {
    getLoginPage,
}