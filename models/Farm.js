const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const farmSchema = new Schema({
        user_id: {type: mongoose.Schema.Types.ObjectId, required: true},
        farmname: {type: String, required: true},
        generateFood: Number
},{timestamps: true});

const Farm = mongoose.model('Farm', farmSchema);

module.exports = Farm
