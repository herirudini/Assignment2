const APIs = require('./APIs/app.js')

const connectDB = require('./config/connect-database.js');
const generatingMachine = require('./config/generating-machine.js')
const port = 3000;


connectDB();
generatingMachine.start();


APIs.listen(port, () => {
console.log(`listening to http://localhost:3000/`)
})
