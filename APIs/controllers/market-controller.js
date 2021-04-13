const Market = require('../models/Market.js');
const User = require('../models/User.js');

class controller {
    static async createMarket (req, res) {
      const user = await User.findById(req.user_id);
      const resources = await user.townhall.resources;
      const gold = await resources.gold;
      const food = await resources.food;
      const inputName = await req.body.marketname;
      let name;
      let createMarket;
      let spendResource;
      let pushNewMarketId;
      if (gold >= 30 && food >= 10) {
        try {
          if (!inputName || inputName.length <= 0) {name = await user.username + "'s market"} else {name = await inputName};
          createMarket = await Market.create({user_id: req.user_id, marketname: name, generateGold: 0})
          spendResource = await User.findByIdAndUpdate(req.user_id, {$inc: {'townhall.resources.gold': -30, 'townhall.resources.food': -10}}, {new: true})
          pushNewMarketId = await User.findByIdAndUpdate(req.user_id, {$push: {markets: createMarket.id}}, {new: true})
        }
        catch (err) {
          console.log(err)
          res.status(500).json({message: "failed to create market!", data: err});
        }
        finally {
          console.log(user)
          res.status(201).json({message: "new market created!", data: createMarket});
        }
      }
      else {
        res.status(403).json({message: "failed: not enough resources!", data: resources});
      }
    }

    static listMyMarkets (req,res,next) {
        Market.find({user_id: req.user_id})
        .then((result) => {
            res.status(200).json({message: "your markets", data: result});
        })
        .catch((err) => {
          next(err)
            // res.status(500).json({message: "failed to show all market!", data: err});
        });
    }

    static async collectMarketById(req, res) {
      const user = await User.findById(req.user_id);
      const market = await Market.findById(req.params.market_id);
      const tryCount = user.townhall.resources.gold + market.generateGold;
      let collect;
      let limits;
      let message;
      let reset;
      try {
        if (tryCount >= 1000) {
          message = "gold is full!"
          limits = await User.findByIdAndUpdate(req.user_id, {'townhall.resources.gold': 1000}, {new: true})
          const remaining = tryCount - 1000;
          reset = await Market.findByIdAndUpdate(req.params.market_id, {generateGold: remaining} , {new: true})
          // console.log(remaining)
          // console.log("try "+tryCount)
          // console.log("market "+market.generateGold)
        } else {
          message = "gold collected: " + market.generateGold
          collect = await User.findByIdAndUpdate(req.user_id, {$inc: {'townhall.resources.gold': market.generateGold}}, {new: true})
          reset = await Market.findByIdAndUpdate(req.params.market_id, {generateGold: 0} , {new: true})
        }
      }
      catch (err){
        console.log(err)
        res.status(500).json({message: "failed to collect gold!", data: err});
      }
      finally {
        res.status(200).json({message: message})
      }
    }

    static editMarketById (req,res,next) {
        const newName = {marketname:  req.body.marketname};
        Market.findByIdAndUpdate(req.params.market_id, newName, {new: true})
        .then((result) => {
            res.status(200).json({message: "market name updated", data: result});
        })
        .catch((err) => {
          next(err)
            // res.status(500).json({message: "failed to rename market!", data: err});
        });
    }
    static deleteMarketById (req, res) {
        Market.findByIdAndDelete(req.params.market_id)
          .then((result) => {
            console.log(result)
            User.findByIdAndUpdate(req.user_id, {$pull: {markets: result.id}}, {new: true})
            .then((userData) => {
                console.log(userData)
            })
            .catch((err) => {
                console.log(err)
            })
            res
              .status(200)
              .json({ message: "market deleted!", data: result })
          })
          .catch((err) => {
            res
              .status(500)
              .json({ message: "failed to delete market!", data: err });
          });
    }

}


module.exports = controller;
