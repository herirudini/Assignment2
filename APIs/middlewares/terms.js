const User = require("../models/User");
const Barrack = require('../models/Barrack.js');


class terms {
  static limitBarrack (req,res,next){ //list first!
      Barrack.find({user_id: req.user_id})
      .then((result)=>{
          console.log("the amount of barrack: " + result.length)
          if(result.length < 20){
              next()
          } else {
              res.status(403).json({success:false, message:"cannot create barrack more than 20"})
          }

      })
      .catch(next)
  }
  static async invadeTerms (req,res,next){
    const attacker = await User.findById(req.user_id);
    const attackerSoldier = attacker.townhall.resources.soldier;
    const attackerDeployedSoldier = await req.body.soldier_to_deploy;
    const defender = await User.findOne({username: req.params.username});
    const defenderSoldier = defender.townhall.resources.soldier;
    try {
      console.log([attackerSoldier, defenderSoldier])
      if (attackerSoldier<attackerDeployedSoldier) {
        res.status(403).json({success:false, message: "insufficient soldier to deploy!"})
      } else if (defenderSoldier<50) {
        res.status(403).json({success: false, message:"attack canceled, the target may already in the battle and doesn't have sufficient soldiers"})
      } else {
        next()
      }
    }
    catch (err) {
      console.log(err)
    }
  }
}


module.exports = terms;
