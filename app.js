require('dotenv').config()
const express = require('express');
const app = express();
const port = process.env.S_PORT;
const connectDB = require('./config/connect-database.js');
const generatingMachine = require('./config/generating-machine.js')

const accountRouter = require('./routes/account-router.js')
const userRouter = require('./routes/user-router.js')
const marketRouter = require('./routes/market-router.js')
const farmRouter = require('./routes/farm-router.js')
const barrackRouter = require('./routes/barrack-router.js')
const invadeRouter = require('./routes/invade-router.js')

connectDB();
generatingMachine.start();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
 //VALIDATION BELOM, REDIRECT BELOM, MATH.RANDOM BELOM, ERRORHANDLER BELOM, RESCODE MASIH ASAL
app.use(accountRouter);

app.use(userRouter);
app.use(marketRouter);
app.use(farmRouter);
app.use(barrackRouter);

app.use(invadeRouter);

//FOOTER//

app.use((req, res) => {
    res.sendStatus(404)
})

app.listen(port, () => {
console.log(`listening to http//localhost:3000/`)
})
