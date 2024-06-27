import express from 'express';
import { createItem, searchPolicy } from '../controllers/mainController.js';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';


const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Specify the upload directory here
  },
  filename: (req, file, cb) => {
    // Proceed with file handling
    const uniqueId = uuidv4();
    const extension = path.extname(file.originalname);
    const uniqueFileName = `${uniqueId}${extension}`;

    cb(null, uniqueFileName); // Keep the original filename
  },
});

const upload = multer({ storage });

// POST route to handle file upload
router.post('/upload', upload.single('file'), createItem);

router.get('/search-policy', searchPolicy);


export default router;
