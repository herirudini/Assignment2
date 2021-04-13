const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('mongoose-validators')

const userSchema = new Schema({
        username: {type: String, required: true},
        email: {type: String,
        validate: validator.isEmail(),
        required: true},
        password: {
        type: String,
        required: true, select: false},
        townhall: {
            level: String,
            resources: {
                gold: {type: Number},
                food: {type: Number},
                soldier: {type: Number},
                medal: {type: Number}
            }
        },
        markets: [{type: Schema.Types.ObjectId, ref: 'Market'}],
        farms: [{type: Schema.Types.ObjectId, ref: 'Farm'}],
        barracks: [{type: Schema.Types.ObjectId, ref: 'Barrack'}]
},{timestamps: true});

const User = mongoose.model('User', userSchema);
module.exports = User;
