// external import
const express = require("express");
const multer = require("multer");
const path = require("path");

// internal import
require("../firebase");
const firebaseFileUpload = require("../lib/firebaseFileUpload");

// router setup
const router = express.Router();

// multer storage
const storage = multer.memoryStorage();

// multer file upload configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 3000000, //3mb
  },
  fileFilter: (req, file, cb) => {
    const type = file.mimetype;

    if (
      type === "image/png" ||
      type === "image/jpg" ||
      type === "image/jpeg" ||
      type === "image/webp" ||
      type === "image/jfif"
    ) {
      cb(null, true);
    } else {
      cb(
        new Error("Only .jpg, .jpeg, .jfif, .png and .webp formet are allowed!")
      );
    }
  },
});

// receive the file
router.post("/", upload.single("quiz-image"), async (req, res, next) => {
  const ext = path.extname(req.file.originalname);
  const modifiedName =
    req.file.originalname.replace(ext, "").toLowerCase().split(" ").join("-") +
    "-" +
    Date.now() +
    ext;

  const fileBuffer = req.file.buffer;

  const fileobject = new File([fileBuffer], req.file.originalname, {
    type: req.file.mimetype,
  });

  const img_link = await firebaseFileUpload(fileobject, modifiedName);

  req.img_link = img_link;
  req.img_ref = modifiedName;
  next();
});

module.exports = router;
