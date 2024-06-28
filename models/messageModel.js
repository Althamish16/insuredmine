import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    message: String,
    createdAt:{
        type: Date,
        default: Date.now
    },
});


const Message = mongoose.model('Message', messageSchema);

export default Message;