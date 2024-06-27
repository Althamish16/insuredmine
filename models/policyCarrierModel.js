import mongoose from 'mongoose';

const { Schema } = mongoose;

const policyCarrierSchema = new Schema({
    companyId: {
        type: String,
        required: true,
        unique: true
    },
    company_name: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: null
    }
});

const PolicyCarrier = mongoose.model('policycarriers', policyCarrierSchema);

export default PolicyCarrier;
