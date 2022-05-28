const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");
require("dotenv").config();

import { v4 as uuidv4 } from "uuid";

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const fileFilter = (req, file, cb) => {
  const typeArray = file.mimetype.split("/");
  const fileType = typeArray[1];
  if (
    fileType == "jpg" ||
    fileType == "png" ||
    fileType == "jpeg" ||
    fileType == "gif" ||
    fileType == "webp"
  ) {
    cb(null, true);
  } else {
    cb({ msg: "jpg, png, jpeg, gif, webp 파일만 업로드 가능합니다." }, false);
  }
};

let productImgUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: "public-read",
    key: (req, file, cb) => {
      cb(null, `products/${Date.now()}_${file.originalname}`);
    },
  }),
  fileFilter: fileFilter,
});

const userS3 = new aws.S3({
  endpoint: new aws.Endpoint(process.env.IMAGE_ENDPOINT),
  accessKeyId: process.env.IMAGE_ACCESSKEY,
  secretAccessKey: process.env.IMAGE_SECRETACCESSKEY,
  region: process.env.IMAGE_REGION,
});

let userImageUpload = multer({
  storage: multerS3({
    s3: userS3,
    bucket: process.env.IMAGE_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: "public-read",
    key: (req, file, cb) => {
      cb(null, `users/${Date.now()}_${uuidv4()}`);
    },
  }),
  fileFilter: fileFilter,
});

exports.userImageUpload = multer(userImageUpload);
exports.productImgUpload = multer(productImgUpload);