
const mongoose = require('mongoose');

const moodLogSchema = new mongoose.Schema({
    // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mood: { type: Number, required: true },
    journal: { type: String },
    chakraAnalysis: { type: Array } 
}, { timestamps: true });

// The 'mongoose.models.MoodLog' check prevents a Mongoose OverwriteModelError.
module.exports = mongoose.models.MoodLog || mongoose.model('MoodLog', moodLogSchema);
