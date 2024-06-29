import express from 'express';
import mainRoutes from './routes/mainRoutes.js' 
import {connectDB} from './connection/connection.js';
import dotenv from 'dotenv';
import cron from 'node-cron';
import { movePlannedMessagesToMessages } from './services/messageService.js';
import { monitorCPU } from './services/monitorService.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api', mainRoutes);

// Start the server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//Message Planner will auto matically trigger for every one minute
cron.schedule('* * * * *', movePlannedMessagesToMessages); 

// Monitoring the CPU
setInterval(monitorCPU, 5000);