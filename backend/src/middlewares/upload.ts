import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "inventory",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  } as any,
});



export const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
  fileFilter(req, file, cb) {
    console.log("📸 FILE RECEIVED:", {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    });
  
    if (!file.mimetype.startsWith("image/")) {
      console.log("❌ INVALID FILE TYPE");
      cb(new Error("Only image files allowed"));
    } else {
      cb(null, true);
    }
  },
  
});
