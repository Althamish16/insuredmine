import express from 'express';
import { createItem, searchPolicy, creatMessage, aggregatedPolicy } from '../controllers/mainController.js';
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
    const uniqueFileName = `${uniqueId}${extension}`; //giving unique file name

    cb(null, uniqueFileName); 
  },
});

const upload = multer({ storage });

// POST route to handle file upload
router.post('/upload', upload.single('file'), createItem);

// GET route to fetch the data by user name in query params
router.get('/search-policy', searchPolicy);

// GET route to fetch the policy info by aggrigation method, pass the userId in URL
router.get('/users/:userId/aggregated-policy', aggregatedPolicy);

// POST route to create planned message
router.post('/message', creatMessage);

export default router;
