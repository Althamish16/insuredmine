import mongoose from 'mongoose';

const connectDB = async () => {
  try {

    if (mongoose.connection.readyState === 0) { // 0 means disconnected

      await mongoose.connect('mongodb://localhost:27017/insurance', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      
      console.log('MongoDB connected');
    
    }


  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); // Exit process with failure
  }
};

const connectionClose = async () => {
  mongoose.connection.close();
};

export { connectDB, connectionClose };
