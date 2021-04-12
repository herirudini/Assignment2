const mongoose = require('mongoose');

const connect = () => {
    const db = mongoose.connection;
    const pathUrl = process.env.DB_URI;
    const connectOption = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }

    mongoose.connect(pathUrl, connectOption)


    db.on('error', console.error.bind(console, "database connection error:"));
    db.once('open', function() {
       console.log("connected to database: mongodb://localhost/db_cov")
    });
};


module.exports = connect;
