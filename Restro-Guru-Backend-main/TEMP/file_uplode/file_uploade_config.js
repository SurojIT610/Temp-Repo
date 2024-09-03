// consume multer
const multer = require("multer");

//**FILE CONFIG */
const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname == "image") {
      cb(null, "public/uploads/foods");
    } else if (file.fieldname == "pro_pic") {
      cb(null, "public/uploads/users");
    } else {
      cb(null, "public/uploads/others");
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const uploadObj = multer({
  limits: {
    fileSize: 5000000, // 1mb
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname == "image") {
      if (
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/gif"
      ) {
        cb(null, true);
      } else {
        cb(
          new Error("only *.jpeg||*.jpg||*.png||*.gif filetypes are allowed"),
          false
        );
      }
    } else if (file.fieldname == "pro_pic") {
      if (
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/gif"
      ) {
        cb(null, true);
      } else {
        cb(
          new Error("only *.jpeg||*.jpg||*.png||*.gif filetypes are allowed"),
          false
        );
      }
    } else {
      cb(new Error("something went wrong....!"), false);
    }
  },
  storage: fileStorage,
});

module.exports = uploadObj;
console.log("file uplode config is ready to use ......!");
