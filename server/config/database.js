const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const connectDB = async (req, res, next) => {
    try {
        const connect = await mongoose.connect(process.env.MongoURL)
        console.log(`Database connection established : ${connect.connection.host}`);
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectDB;