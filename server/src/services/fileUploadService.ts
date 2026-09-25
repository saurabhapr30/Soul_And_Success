import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { BadRequestError } from '../utils/errors';
import { uploadsDir } from '../utils/uploadPaths';

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage configuration (Local storage)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter to only allow images for certain endpoints
const imageFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new BadRequestError('Not an image! Please upload only images.'), false);
  }
};

export const uploadImage = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

export const uploadDocument = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

export const fileUploadService = {
  // Helper to generate URL for a file
  getFileUrl: (req: any, filename: string) => {
    return `/uploads/${filename}`;
  }
};
