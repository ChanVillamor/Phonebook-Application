const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    mobileNo: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    address: {
        type: String,
        trim: true
    },
    facebook: {
        type: String,
        trim: true
    },
    instagram: {
        type: String,
        trim: true
    },
    notes: {
        type: String,
        trim: true
    },
    image: {
        type: String,  // Store image path/URL
        default: null
    },
    favorite: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['none', 'hotline', 'family', 'work', 'friend'],
        default: 'none'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
contactSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Create indexes for search functionality
contactSchema.index({ name: 'text', email: 'text', mobileNo: 'text' });

module.exports = mongoose.model('Contact', contactSchema); 