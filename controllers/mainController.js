import { uploadData } from '../services/uploadService.js';
import fs from 'fs-extra';
import path from 'path';
import { convertXlsxToCsv } from '../utils/utility.js';
import User from '../models/userModel.js';
import PolicyInfo from '../models/policyInfoModel.js';

const uploadDir = path.resolve('./uploads');

export const createItem = async (req, res) => {
  try {
    const file = req.file;

    const filePath = path.join(uploadDir, file.filename);

    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {

      const csvFilePath = await convertXlsxToCsv(filePath);

      await fs.remove(filePath); // Remove the original XLSX file after conversion

      await uploadData(req, res, csvFilePath);

    } else if (file.mimetype === 'text/csv') {

      await uploadData(req, res, filePath);


    } else {
      // Unsupported file type
      res.status(400).send({ message: 'Unsupported file type' });
    }
  } catch (error) {
    console.error('Error uploading or processing file', error);
    res.status(500).send({ message: 'Error uploading or processing file', error });
  }
};

export const searchPolicy = async (req, res) => {
  const username = req.query.username;

  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }

  try {
    // Step 2: Retrieve User Information
    const user = await User.findOne({ firstname: username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Step 3: Retrieve Policy Information
    const policies = await PolicyInfo.find({ userId: user.userId })

    res.status(200).json({
      user: {
        firstname: user.firstname,
        dob: user.dob,
        address: user.address,
        phone: user.phone,
        state: user.state,
        zip: user.zip,
        email: user.email,
        gender: user.gender,
        userType: user.userType,
      },
      policies: policies
    });
  
  } catch (error) {

    console.error('Error retrieving policy information:', error);
    
    res.status(500).json({ message: 'Error retrieving policy information', error });
  
  }

}


