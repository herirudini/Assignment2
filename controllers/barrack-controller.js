const Barrack = require('../models/Barrack.js');
const User = require('../models/User.js');

class controller {
    static async createBarrack (req, res) {
      const user = await User.findById(req.user_id);
      const resources = await user.townhall.resources;
      const gold = await resources.gold;
      const food = await resources.food;
      const inputName = await req.body.barrackname;
      let name;
      let createBarrack;
      let spendResource;
      let pushNewBarrackId;
      if (gold >= 30 && food >= 30) {
        try {
          if (!inputName || inputName.length <= 0) {name = await user.username + "'s barrack"} else {name = await inputName};
          createBarrack = await Barrack.create({user_id: req.user_id, barrackname: name, generateSoldier: 0})
          spendResource = await User.findByIdAndUpdate(req.user_id, {$inc: {'townhall.resources.gold': -30, 'townhall.resources.food': -30}}, {new: true})
          pushNewBarrackId = await User.findByIdAndUpdate(req.user_id, {$push: {barracks: createBarrack.id}}, {new: true})
        }
        catch (err) {
          console.log(err)
          res.status(500).json({message: "failed to create barrack!", data: err});
        }
        finally {
          console.log(user)
          res.status(201).json({message: "new barrack created!", data: createBarrack});
        }
      }
      else {
        res.status(403).json({message: "failed: not enough resources!", data: resources});
      }
    }

    static listMyBarracks (req,res,next) {
        Barrack.find({user_id: req.user_id})
        .then((result) => {
            res.status(200).json({message: "your barracks", data: result});
        })
        .catch((err) => {
          next(err)
            // res.status(500).json({message: "failed to show all barrack!", data: err});
        });
    }

    static async collectBarrackById(req, res) {
      const user = await User.findById(req.user_id);
      const barrack = await Barrack.findById(req.params.barrack_id);
      const tryCount = user.townhall.resources.soldier + barrack.generateSoldier
      let collect;
      let limits;
      let message;
      let reset;
      try {
        if (tryCount >= 500) {
          message = "soldier is full!"
          limits = await User.findByIdAndUpdate(req.user_id, {'townhall.resources.soldier': 500}, {new: true})
          const remaining = tryCount - 500;
          reset = await Barrack.findByIdAndUpdate(req.params.barrack_id, {generateSoldier: remaining} , {new: true})
          console.log("soldier remaining: " + remaining)
        } else {
          message = "soldier collected: " + barrack.generateSoldier
          collect = await User.findByIdAndUpdate(req.user_id, {$inc: {'townhall.resources.soldier': barrack.generateSoldier}}, {new: true})
          reset = await Barrack.findByIdAndUpdate(req.params.barrack_id, {generateSoldier: 0} , {new: true})
        }
      }
      catch (err){
        console.log(err)
      }
      finally {
        res.status(200).json({message: message})
      }
    }

    static editBarrackById (req, res) {
        const newName = {barrackname:  req.body.barrackname};
        Barrack.findByIdAndUpdate(req.params.barrack_id, newName, {new: true})
        .then((result) => {
            res.status(200).json({message: "barrack name updated", data: result});
        })
        .catch((err) => {
          next(err)
            // res.status(500).json({message: "failed to rename barrack!", data: err});
        });
    }
    static deleteBarrackById (req, res) {
        Barrack.findByIdAndDelete(req.params.barrack_id)
          .then((result) => {
            console.log(result)
            User.findByIdAndUpdate(req.user_id, {$pull: {barracks: result.id}}, {new: true})
            .then((userData) => {
                console.log(userData)
            })
            .catch((err) => {
                console.log(err)
            })
            res
              .status(200)
              .json({ message: "barrack deleted!", data: result })
          })
          .catch((err) => {
            res
              .status(500)
              .json({ message: "failed to delete barrack!", data: err });
          });
    }

}


module.exports = controller;
