const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const barrackSchema = new Schema({
        user_id: {type: mongoose.Schema.Types.ObjectId, required: true},
        barrackname: {type: String, required: true},
        generateSoldier: Number
},{timestamps: true});

const Barrack = mongoose.model('Barrack', barrackSchema);

module.exports = Barrack
