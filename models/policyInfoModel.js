import mongoose from 'mongoose';

const { Schema } = mongoose;

const policyInfoSchema = new Schema({
    policyId:{
        type: String,
        required: true,
    },
    policy_number: String,
    policy_start_date: String,
    policy_end_date: String,
    policy_type:String,
    policy_mode: Number,
    csr: String,
    premium_amount_written: Number,
    premium_amount: Number,
    producer: String,
    hasActiveClientPolicy: {
        type: String,
        default: 'true'
    },
    categoryId: {
        type: String,
        required: true,
        unique: true,
        ref: 'policycategories'
    },
    companyId:{
        type: String,
        required: true,
        unique: true,
        ref: 'policycarriers'
    },
    userId: {
        type: String,
        required: true,
        unique: true,
        ref: 'users'
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

const PolicyInfo = mongoose.model('policyinfos', policyInfoSchema);

export default PolicyInfo;
