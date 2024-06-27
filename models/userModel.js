import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    firstname: {
        type: String,
    },
    dob: String,
    address: String,
    phone: {
        type: String,
    },
    state: String,
    zip: String,
    email: String,
    gender: String,
    userType: String,
    city:String,
    primary: {
        type: String,
        default: 'false'
    },
    agentId: {
        type: String,
        required: true,
        unique: true,
        ref: 'agents'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: null
    }
    

});

const User = mongoose.model('users', userSchema);

export default User;



//User - first name, DOB, address, phone number, state, zip code, email, gender, userType, agentCode, 