const User = require('../models/User.js');

class controller {
  static listTarget (req, res) {
      User.find({'townhall.resources.soldier': {$gte: 50}}).select('username')
      .then ((result)=> {
        res.status(200).json({message: "target list", data: result});
      })
      .catch ((err)=> {
        next(err)
        // res.status(500).json({message: "failed to list target!", data: err})
      })
  }
  static checkTargetByUsername (req,res,next) {
      User.findOne({username: req.params.username}).select(['townhall.resources.gold', 'townhall.resources.food', 'townhall.resources.medal', 'username'])
      .then((result) => {
        console.log(req.user_id)
          if (result == null) {
            throw ({name: 'not_found'})
            // res.status(404).json({message: "target not found or already deleted", data: result});
          }
          res.status(200).json({message: "target found", data: result});
      })
      .catch((err) => {
        next(err)
          // res.status(404).json({message: "target not found!", data: err});
      });
  }
  static async attackTargetByUsername (req, res) {
    function randomBattle(attack, defend) {
      const arr = [];
      for (let i = 0; i < 3; i++) {
        arr.push(Math.random() < attack / (defend + 1));
      }
      return arr.filter((el) => el).length >= 2 ? true : false;
    }
    const attacker = await User.findById(req.user_id);
    const attackerMedal = attacker.townhall.resources.medal;
    const attackerDeployedSoldier = await req.body.soldier_to_deploy;
    const defender = await User.findOne({username: req.params.username}).select('townhall');
    const defenderSoldier = await defender.townhall.resources.soldier;
    const defenderGold = await defender.townhall.resources.gold;
    const defenderFood = await defender.townhall.resources.food;
    const bet = {gold: Math.ceil(defenderGold/2), food: Math.ceil(defenderFood/2), defenderSoldier: defenderSoldier, medal: Math.floor(attackerMedal/2), attackerDeployedSoldier: attackerDeployedSoldier};
    let attackerResourcesAfter;
    let defenderResourcesAfter;
    let message;
    let limitGold;
    let limitFood;

    try {
      let gameWin = await randomBattle(attackerDeployedSoldier, defenderSoldier);
      if (gameWin) {
        message = "You win! (overload resources would be adjusted)"
        const attackerWinBet = {$inc: {'townhall.resources.medal': 5, 'townhall.resources.gold': bet.gold, 'townhall.resources.food': bet.food, 'townhall.resources.soldier': -bet.attackerDeployedSoldier}}
        const defenderLoseBet = {$inc: {'townhall.resources.gold': -bet.gold, 'townhall.resources.food': -bet.food, 'townhall.resources.soldier': -bet.defenderSoldier}}
        attackerResourcesAfter = await User.findByIdAndUpdate(req.user_id, attackerWinBet, {new: true}).select(['townhall', 'username']);
        defenderResourcesAfter = await User.findOneAndUpdate({username: req.params.username}, defenderLoseBet, {new: true}).select(['townhall', 'username']);
      } else {
        message = "You lose!"
        const attackerLoseBet = {$inc: {'townhall.resources.medal': -bet.medal, 'townhall.resources.soldier': -bet.attackerDeployedSoldier}};
        const defenderWinBet = {$inc: {'townhall.resources.medal': 2}}
        attackerResourcesAfter = await User.findByIdAndUpdate(req.user_id, attackerLoseBet, {new: true}).select(['townhall', 'username']);
        defenderResourcesAfter = await User.findOneAndUpdate({username: req.params.username}, defenderWinBet, {new: true}).select(['townhall', 'username']);
      }
    }
    catch (err) {
      console.log(err)
    }
    finally {
      if (attackerResourcesAfter.townhall.resources.gold >= 1000) {limitGold = await User.findByIdAndUpdate(req.user_id, {'townhall.resources.gold': 1000}, {new: true})}
      if (attackerResourcesAfter.townhall.resources.food >= 1000) {limitFood = await User.findByIdAndUpdate(req.user_id, {'townhall.resources.food': 1000}, {new: true})}
      res.status(201).json({message: message, data: [attackerResourcesAfter, defenderResourcesAfter]})
      // .then ((limit)=> {
      //
      // }
    }
  }
}

module.exports = controller;
