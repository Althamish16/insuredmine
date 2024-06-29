import mongoose from "mongoose";

const PlannedMessageSchema = new mongoose.Schema({
  message: { type: String, required: true },
  day: { type: String, required: true },
  time: { type: String, required: true },
  datetime: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

const PlannedMessage  = mongoose.model('plannedmessages', PlannedMessageSchema);


export default PlannedMessage;