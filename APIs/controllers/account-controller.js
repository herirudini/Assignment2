const User = require('../models/User.js');
const bcrypt =  require('bcrypt');
const jwt = require('jsonwebtoken');
const temp = require('../../config/tmp.json')
const validator = require('mongoose-validators')

class controller {
    static signup (req, res) {
        User.create({
            username: req.body.new_username,
            email: req.body.new_email,
            password: bcrypt.hashSync(req.body.new_password,8),
            mynumbers: 0,
            townhall: {
                level: "Top Dunia Akhirat",
                resources: {
                    gold: 100,
                    food: 100,
                    soldier: 0,
                    medal: 0,
                }
            }
        })
        .then((result) => {
          res.status(201).json({message: "signup success: please login", data: result})
          console.log("new user created: "+result)
          // res.redirect('../login');
        })
        .catch((err) => {
          // throw ({name: 'invalid_email'})
            res.status(422).json({message: "signup failed!", data: err});
        });
    }
    static login (req,res,next) {
        User.findOne({email: req.body.email}).select('+password')
        .then((result)=> {
            if (!result) {
              throw({name: 'not_verified'})
                // return res.status(401).json({success: false, message: "worng email/password"})
            }
            const passwordIsValid = bcrypt.compareSync(req.body.password, result.password)
            if (passwordIsValid) {
              const token = jwt.sign({id: result.id}, process.env.DB_USER, {noTimestamp: true}, {expiresIn: '3h'})
              temp.push({"tempToken": token});
              // res.redirect('/user/home');
              res.status(202).json({message: "success login", data:result, AccessToken: token})
            } else {
              throw({name: 'not_verified'})
              // return res.status(301).json({sucsess: false, message: "wrong email/password"})
            }
        })
        .catch((err)=> {
            console.log(err);
            next(err)
            // res.status(500).json({message: "login error"})
        })
    }
    static async logout (req,res,next) {
      const access_token = await req.headers.access_token;
      const temp_token = await temp.findIndex(tT=> tT.tempToken === access_token)
      let removeTempToken;
      try {
        removeTempToken = await temp.splice(temp_token,1)
      }
      catch (err) {
        next(err)
        // console.log("failed to remove token"+err)
      }
      finally {
        res.status(401).json({message: "success logout"})
        // res.redirect('/login')
      }
    }
}

module.exports = controller;
