import fs from "node:fs";
import path from "node:path";
import multer from "multer";

const uploadDirectory = path.resolve(process.cwd(), "public/uploads/users");

fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadDirectory);
  },
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname) || ".jpg";
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1_000_000)}${extension}`;
    callback(null, fileName);
  },
});

function fileFilter(
  _req: Express.Request,
  file: Express.Multer.File,
  callback: multer.FileFilterCallback
) {
  if (file.mimetype.startsWith("image/")) {
    callback(null, true);
    return;
  }

  callback(new Error("Only image files are allowed"));
}

export const uploadUserImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
}).single("profileImage");
