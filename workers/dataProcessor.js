import { parentPort, workerData } from 'worker_threads';
import fs from 'fs';
import csv from 'csv-parser';
import Agent from '../models/agentModel.js';
import User from '../models/userModel.js';
import UserAccount from '../models/userAccountsModel.js';
import PolicyCategory from '../models/policyCategoryModel.js';
import PolicyCarrier from '../models/policyCarrierModel.js';
import PolicyInfo from '../models/policyInfoModel.js';
import mongoose from 'mongoose';
import { connectDB, connectionClose } from '../connection/connection.js';
import { v4 as uuidv4 } from 'uuid';

const csvFilePath = workerData.csvFilePath;
const CHUNK_SIZE = 100; // Number of documents to process per chunk

// const connectDB = async () => {
//         await mongoose.connect('mongodb://localhost:27017/insurance', {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });
//         console.log('MongoDB connected');
// };

const processAndSaveData = async (collectionName, data) => {
    await connectDB();

    switch (collectionName) {
        case 'Agent':
            await Agent.insertMany(data);
            break;
        case 'User':
            await User.insertMany(data);
            break;
        case 'UserAccount':
            await UserAccount.insertMany(data);
            break;
        case 'PolicyCategory':
            await PolicyCategory.insertMany(data);
            break;
        case 'PolicyCarrier':
            await PolicyCarrier.insertMany(data);
            break;
        case 'PolicyInfo':
            await PolicyInfo.insertMany(data);
            break;
        default:
            throw new Error('Invalid collection name');
    }

};

(async () => {
    try {
        await connectDB();

        let currentChunk = [];
        let rowCount = 0;

        // Helper function to process the current chunk
        const processChunk = async () => {
            if (currentChunk.length > 0) {
                const collectionsToSave = identifyAndSplitCollections(currentChunk);
                await Promise.all(Object.entries(collectionsToSave).map(([collectionName, data]) => {
                    return processAndSaveData(collectionName, data);
                }));
                currentChunk = [];
            }
        };

        // Read CSV file and process rows
        const stream = fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', async (row) => {
                rowCount++;
                currentChunk.push(row);

                // Process chunks of data
                if (currentChunk.length === CHUNK_SIZE) {
                    stream.pause(); // Pause the stream
                    await processChunk();
                    stream.resume(); // Resume the stream
                }
            })
            .on('end', async () => {
                // Process any remaining data
                if (currentChunk.length > 0) {
                    await processChunk();
                }

                fs.unlinkSync(csvFilePath); // Remove the file after processing
                
                parentPort.postMessage({ status: 'success' });
            });

    } catch (err) {
        parentPort.postMessage({ status: 'error', error: err.message });
    }
})();

export function identifyAndSplitCollections(data) {
    const collections = {
        Agent: [],
        User: [],
        UserAccount: [],
        PolicyCategory: [],
        PolicyCarrier: [],
        PolicyInfo: []
    };


    data.forEach(item => {

        const agentId = uuidv4();
        const userId = uuidv4();
        const policyId = uuidv4();
        const categoryId = uuidv4();
        const companyId = uuidv4();

        collections.Agent.push({
            agentId: agentId,
            agentName: item.agent
        });

        collections.User.push({
            firstname: item.firstname,
            dob: item.dob,
            address: item.address,
            phone: item.phone,
            state: item.state,
            zip: item.zip,
            email: item.email,
            gender: item.gender,
            userType: item.userType,
            city: item.city,
            primary: item.primary,
            agentId: agentId,
            userId: userId,
        });

        collections.UserAccount.push({
            account_name: item.account_name,
            userId: userId,
            account_type: item.account_type
        });

        collections.PolicyCategory.push({
            category_name: item.category_name,
            categoryId: categoryId
        });

        collections.PolicyCarrier.push({
            company_name: item.company_name,
            companyId: companyId
        });
        collections.PolicyInfo.push({
            policyId: policyId,
            policy_number: item.policy_number,
            policy_start_date: item.policy_start_date,
            policy_end_date: item.policy_end_date,
            policy_type: item.policy_type,
            policy_mode: item.policy_mode,
            hasActiveClientPolicy: item['hasActive ClientPolicy'],
            csr: item.csr,
            premium_amount_written: item.premium_amount_written,
            premium_amount: item.premium_amount,
            producer: item.producer,
            categoryId: categoryId,
            companyId: companyId,
            userId: userId
        });

    });

    return collections;
}

