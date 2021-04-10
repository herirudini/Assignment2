
const Market = require('../models/Market.js');
const Farm = require('../models/Farm.js');
const Barrack = require('../models/Barrack.js');
const cron = require('node-cron');

const generateResources = cron.schedule(
  '*/1 * * * *',
function() {
  Market.updateMany({generateGold: {$lt: 20}}, {$inc: {generateGold: 1}})
    .then((_)=>{})
    .catch((_)=>{});
  Farm.updateMany({generateFood: {$lt: 20}}, {$inc: {generateFood: 1}})
    .then((_)=>{})
    .catch((_)=>{});
  Barrack.updateMany({generateSoldier: {$lt: 10}}, {$inc: {generateSoldier: 1}})
    .then((_)=>{})
    .catch((_)=>{});
  },
  {schedule: true}
);

module.exports = generateResources;
