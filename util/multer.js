const multer  = require('multer')

//multer - To store image
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    return cb(null, uniquePrefix + file.originalname);
  }
})

const upload = multer({ storage: storage })

module.exports = upload;