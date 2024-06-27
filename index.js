import express from 'express';
import mainRoutes from './routes/mainRoutes.js' 
import {connectDB} from './connection/connection.js';
import dotenv from 'dotenv';

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
