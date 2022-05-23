import multer from "multer";
import fs from "fs";

try {
  fs.readdirSync("uploads"); 
} catch (err) {
  fs.mkdirSync("uploads");
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, process.env.IMAGE_DIR);
    },
    filename(req, file, cb) {
      cb(null, Date.now() + file.originalname);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, 
});

export { upload };
