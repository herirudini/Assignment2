const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const marketSchema = new Schema({
        user_id: {type: mongoose.Schema.Types.ObjectId, required: true},
        marketname: {type: String, required: true},
        generateGold: Number
},{timestamps: true});

const Market = mongoose.model('Market', marketSchema);

module.exports = Market
