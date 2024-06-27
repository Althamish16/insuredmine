import mongoose from 'mongoose';

const { Schema } = mongoose;

const userAccountSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
        ref: 'users'
    },
    account_name: String,
    account_type: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: null
    }
});

const UserAccount = mongoose.model('useraccounts', userAccountSchema);

export default UserAccount;
