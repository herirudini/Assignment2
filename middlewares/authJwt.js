
const jwt = require("jsonwebtoken");
const bcrypt =  require('bcrypt');
const temp = require('../config/tmp.json');
const User = require("../models/User");
const Market = require('../models/Market.js');
const Farm = require('../models/Farm.js');
const Barrack = require('../models/Barrack.js');


class authJwt {
  static async authentication (req,res,next){
      const access_token = await req.headers.access_token;
      const temp_token = await temp.findIndex(tT=> tT.tempToken === access_token)
      try {
        if  (!access_token){
          throw ({name: 'missing_token'})
          // res.status(401).json({message: "missing_token"})
        } else if (temp_token == -1){
          throw ({name: 'incorrect_token'})
          // res.status(401).json({message: "wrong_token: please login"})
        } else {
          jwt.verify(access_token, process.env.DB_USER, (err, decoded)=>{
              if (err){
                throw ({name: 'invalid_token'})
                  // res.status(401).json({success:false, message:"invalid token"})
              }
              req.user_id = decoded.id;
          })
          next();
        }
      }
      catch (err){
        // console.log(err)
        next(err)
      }
  }
    static async uniqueData (req, res, next){
      const checkEmail = await User.find({email: req.body.new_email})
      const checkUsername = await User.find({username: req.body.new_username})
      try {
        if (checkEmail.length != 0) {
          throw ({name: 'unique_email'})
          // res.status(403).json({message: "this email is already taken! use another!"})
        } else if (checkUsername.length != 0) {
          throw ({name: 'unique_username'})
          // res.status(403).json({message: "this username is already taken! use another!"})
        } else {
          next()
        }
      }
      catch (err) {
        console.log(err)
        next (err)
      }
    }
    static async twoStepAuth (req, res, next){
      const author = await User.findById(req.user_id).select('+password')
      try {
        if (!req.body.password) {
          res.status(402).json({success: false, message: "Please input password!"})
        } else {
          const match = await bcrypt.compareSync(req.body.password, author.password);
          if(!match) {
            throw ({name: 'twostep_auth'})
            // res.status(401).json({success: false, message: "Incorrect Password"})
          } else{
            next()
          }
        }
      }
      catch(err) {
        console.log(err)
        next(err)
      }
    }
    static async marketAuthor (req,res,next){
        const author = await Market.findById(req.params.market_id)
        try {
          if (!author) {
            throw ({name: 'not_found'})
          } else if (req.user_id != author.user_id) {
            throw({name: 'unauthorized'})
              // res.status(403).json({success:false, message:"forbidden access"})
          } else {
              next()
          }
        }
        catch (err) {
          // console.log(err)
          next(err)
        }
    }
    static async farmAuthor (req,res,next){
        const author = await Farm.findById(req.params.farm_id)
        try {
          if (!author) {
            throw ({name: 'not_found'})
          } else if (req.user_id != author.user_id) {
            throw({name: 'unauthorized'})
              // res.status(403).json({success:false, message:"forbidden access"})
          } else {
            next()
          }
        }
        catch (err) {
          next(err)
        }
    }
    static async barrackAuthor (req,res,next){
        const author = await Barrack.findById(req.params.barrack_id)
        try {
          if (!author) {
            throw ({name: 'not_found'})
          } else if (req.user_id != author.user_id) {
            throw({name: 'unauthorized'})
              // res.status(403).json({success:false, message:"forbidden access"})
          } else {
            next()
          }
        }
        catch (err) {
          next(err)
        }
    }
}

module.exports = authJwt;
