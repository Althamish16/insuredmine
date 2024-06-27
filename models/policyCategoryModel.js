import mongoose from 'mongoose';

const { Schema } = mongoose;

const policyCategorySchema = new Schema({
    categoryId: {
        type: String,
        required: true,
        unique: true
    },
    category_name: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: null
    }
});

const PolicyCategory = mongoose.model('policycategories', policyCategorySchema);

export default PolicyCategory;
