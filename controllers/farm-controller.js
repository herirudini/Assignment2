const Farm = require('../models/Farm.js');
const User = require('../models/User.js');

class controller {
    static async createFarm (req, res) {
      const user = await User.findById(req.user_id);
      const resources = await user.townhall.resources
      const gold = await resources.gold;
      const food = await resources.food;
      const inputName = await req.body.farmname
      let name;
      let createFarm;
      let spendResource;
      let pushNewFarmId;
      if (gold >= 10 && food >= 30) {
        try {
          if (!inputName || inputName.length <= 0) {name = await user.username + "'s farm"} else {name = await inputName};
          createFarm = await Farm.create({user_id: req.user_id, farmname: name, generateFood: 0})
          spendResource = await User.findByIdAndUpdate(req.user_id, {$inc: {'townhall.resources.gold': -10, 'townhall.resources.food': -30}}, {new: true})
          pushNewFarmId = await User.findByIdAndUpdate(req.user_id, {$push: {farms: createFarm.id}}, {new: true})
        }
        catch (err) {
          console.log(err)
          res.status(500).json({message: "failed to create farm!", data: err});
        }
        finally {
          console.log(user)
          res.status(201).json({message: "new farm created!", data: createFarm});
        }
      }
      else {
        res.status(403).json({message: "failed: not enough resources!", data: resources});
      }
    }

    static listMyFarms (req,res,next) {
        Farm.find({user_id: req.user_id})
        .then((result) => {
            res.status(200).json({message: "your farms", data: result});
        })
        .catch((err) => {
          next(err)
            // res.status(500).json({message: "failed to show all farm!", data: err});
        });
    }

    static async collectFarmById(req, res) {
      const user = await User.findById(req.user_id);
      const farm = await Farm.findById(req.params.farm_id);
      const tryCount = user.townhall.resources.food + farm.generateFood;
      let collect;
      let limits;
      let message;
      let reset;
      try {
        if (tryCount >= 1000) {
          message = "food is full!"
          limits = await User.findByIdAndUpdate(req.user_id, {'townhall.resources.food': 1000}, {new: true})
          const remaining = tryCount - 1000;
          reset = await Farm.findByIdAndUpdate(req.params.farm_id, {generateFood: remaining} , {new: true})
          console.log("food remaining: " + remaining)
        } else {
          message = "food collected: " + farm.generateFood
          collect = await User.findByIdAndUpdate(req.user_id, {$inc: {'townhall.resources.food': farm.generateFood}}, {new: true})
          reset = await Farm.findByIdAndUpdate(req.params.farm_id, {generateFood: 0} , {new: true})
        }
      }
      catch (err){
        console.log(err)
      }
      finally {
        res.status(200).json({message: message})
      }
    }

    static editFarmById (req,res,next) {
        const newName = {farmname:  req.body.farmname};
        Farm.findByIdAndUpdate(req.params.farm_id, newName, {new: true})
        .then((result) => {
            res.status(200).json({message: "farm name updated", data: result});
        })
        .catch((err) => {
          next(err)
            // res.status(500).json({message: "failed to rename farm!", data: err});
        });
    }
    static deleteFarmById (req, res) {
        Farm.findByIdAndDelete(req.params.farm_id)
          .then((result) => {
            console.log(result)
            User.findByIdAndUpdate(req.user_id, {$pull: {farms: result.id}}, {new: true})
            .then((userData) => {
                console.log(userData)
            })
            .catch((err) => {
                console.log(err)
            })
            res
              .status(200)
              .json({ message: "farm deleted!", data: result })
          })
          .catch((err) => {
            res
              .status(500)
              .json({ message: "failed to delete farm!", data: err });
          });
    }

}


module.exports = controller;
