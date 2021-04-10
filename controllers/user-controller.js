const bcrypt =  require('bcrypt');
const User = require('../models/User.js');
const Market = require('../models/Market.js');
const validator = require('mongoose-validators');

class controller {
    static async myDetails (req,res,next) {
        User.findById(req.user_id).populate(['markets', 'farms', 'baracks'])

        .then((result) => {
            if (result == null) {
              throw({name: 'not_found'})
              // res.status(404).json({message: "account already deleted", data: result});
            }
            res.status(200).json({message: "Your data", data: result});
        })
        .catch((err) => {
          next(err)
        });
    }
    static changeUsername (req,res,next) {
        const newUsername = req.body.new_username;
        console.log(newUsername)
        User.findByIdAndUpdate(req.user_id, {username: newUsername}, {new: true})
        .then((result) => {
            res.status(200).json({message: "Username updated", data: result});
        })
        .catch((err) => {
          next(err)
            // res.status(500).json({message: "update failed!", data: err});
        });
    }
    static changeEmail (req,res,next) {
        const newEmail = req.body.new_email;

        User.findByIdAndUpdate(req.user_id, {email: validator.isEmail(newEmail)}, {new: true})
        .then((result) => {
            res.status(200).json({message: "Email updated", data: result});
            next()
        })
        .catch((err) => {
            res.status(422).json({message: "Update failed: Please input a valid email!", data: err});
        });
    }
    static changePassword (req,res,next) {
        User.findByIdAndUpdate(req.user_id, {password: bcrypt.hashSync(req.body.new_password,8)}, {new: true}).select('+password')
        .then((result) => {
            res.status(200).json({message: "Password changed!", data: result});
            next()
        })
        .catch((err) => {
          next(err)
            // res.status(422).json({message: "failed to change password!", data: err});
        });
    }
    static async deleteMyAccount (req,res,next) {
      const targetUser = await User.findById(req.user_id);
      const marketList = await targetUser.markets;
      const farmList = await targetUser.farms;
      const barrackList = await targetUser.barracks;
      let deleteMarkets;
      let deleteFarms;
      let deleteBarracks;
      let deleteAccount;
      try {
        for (let market_id in marketList) {
          deleteMarkets = await Market.findByIdAndDelete(marketList[market_id])
        }
        for (let farm_id in farmList) {
          deleteFarms = await Farm.findByIdAndDelete(farmList[farm_id])
        }
        for (let barrack_id in barrackList) {
          deleteBarracks = await Barrack.findByIdAndDelete(barrackList[barrack_id])
        }
      }
      catch(err) {
        console.log(err)
      }
      finally {
        deleteAccount = await User.findByIdAndDelete(req.user_id);
        res
          .status(200)
          .json({ message: "account deleted!" });
        next()
      }
    }
}



module.exports = controller;
