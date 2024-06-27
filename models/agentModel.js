import mongoose from 'mongoose';

const { Schema } = mongoose;

const agentSchema = new Schema({
  agentId:{
    type: String,
    required: true,
    unique: true
  },
  agentName: {
    type: String,
  },
  createdAt:{
    type: Date,
    default: Date.now
  },
  updatedAt:{
    type: Date,
    default: null
  }
});

const Agent = mongoose.model('agents', agentSchema);

export default Agent;
