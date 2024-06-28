import { uploadData } from '../services/uploadService.js';
import fs from 'fs-extra';
import path from 'path';
import { convertXlsxToCsv } from '../utils/utility.js';
import User from '../models/userModel.js';
import PolicyInfo from '../models/policyInfoModel.js';
import PlannedMessage from '../models/plannedMessageModel.js';

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
    const users = await User.find({ firstname: { $regex: new RegExp(username, 'i') } });

    if (!users) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Step 3: Retrieve Policy Information
    const userPolicyData = await Promise.all(users.map(async (user) => {
      const policies = await PolicyInfo.find({ userId: user.userId });
      return {
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
      };
    }));

    res.status(200).json(userPolicyData);

  } catch (error) {

    console.error('Error retrieving policy information:', error);

    res.status(500).json({ message: 'Error retrieving policy information', error });

  }

}




export const creatMessage = async (req, res) => {
  const { message, day, time } = req.body;

  if (!message || !day || !time) {
    return res.status(400).json({ error: 'Message, day, and time are required' });
  }


  try {

    const datetimeString = `${day}T${time}`;
    const datetime = new Date(datetimeString);

    const plannedMessage = new PlannedMessage({ message, day, time, datetime });

    await plannedMessage.save();

    res.status(201).json(plannedMessage);

  } catch (error) {

    res.status(500).json({ error: error });

  }

}



export const aggregatedPolicy = async (req, res) => {
  try {

    const userId = req.params.userId;
    
    const aggregatedData = await User.aggregate([
      { $match: { userId: userId } },
      {
        $lookup: {
          from: 'policyinfos', // Collection name for PolicyInfo
          localField: 'userId',
          foreignField: 'userId',
          as: 'policies'
        }
      },
      {
        $unwind: {
          path: '$policies',
          preserveNullAndEmptyArrays: true // Keep users without policies
        }
      },
      {
        $lookup: {
          from: 'policycategories', // Collection name for PolicyCategory
          localField: 'policies.categoryId',
          foreignField: 'categoryId',
          as: 'category'
        }
      },
      {
        $unwind: {
          path: '$category',
          preserveNullAndEmptyArrays: true // Keep policies without categories
        }
      },
      {
        $lookup: {
          from: 'policycarriers', // Collection name for PolicyCarrier
          localField: 'policies.companyId',
          foreignField: 'companyId',
          as: 'carrier'
        }
      },
      {
        $unwind: {
          path: '$carrier',
          preserveNullAndEmptyArrays: true // Keep policies without carriers
        }
      },
      {
        $group: {
          _id: '$userId',
          firstname: { $first: '$firstname' },
          dob: { $first: '$dob' },
          address: { $first: '$address' },
          phone: { $first: '$phone' },
          state: { $first: '$state' },
          zip: { $first: '$zip' },
          email: { $first: '$email' },
          gender: { $first: '$gender' },
          userType: { $first: '$userType' },
          policies: {
            $push: {
              policy_number: '$policies.policy_number',
              policy_start_date: '$policies.policy_start_date',
              policy_end_date: '$policies.policy_end_date',
              category_name: '$category.category_name',
              company_name: '$carrier.company_name',
              policy_mode: '$policies.policy_mode',
              hasActiveClientPolicy: '$policies.hasActiveClientPolicy',
              csr: '$policies.csr',
              premium_amount_written: '$policies.premium_amount_written',
              premium_amount: '$policies.premium_amount',
              producer: '$policies.producer'
            }
          }
        }
      }
    ]);

    res.status(200).json(aggregatedData);
  } catch (error) {
    console.error('Error retrieving aggregated policy information', error);
    res.status(500).json({ message: 'Error retrieving aggregated policy information', error });
  }
}


