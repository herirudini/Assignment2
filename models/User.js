const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('mongoose-validators')
// const validateEmail = function(email) {
//     var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//     return re.test(email)
// };
// const validatePassword = function(password) {
//     var re = /^(?=.*?[a-z])(?=.*?[A-Z])[a-zA-Z0-9]{6,10}$/;
//     return re.test(password)
// };

const userSchema = new Schema({
        username: {type: String, required: true},
        email: {type: String,
        validate: validator.isEmail(),
        // macth: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'please fill a valid email address!'],
        required: true},
        password: {
        type: String,
        // validate: [validateEmail, 'require minimum six characters, one uppercase, one lowercase!'],
        // macth: [/^(?=.*?[a-z])(?=.*?[A-Z])[a-zA-Z0-9]{6,10}$/, 'require minimum four characters, one uppercase, one lowercase!'],
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
