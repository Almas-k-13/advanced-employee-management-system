const mongoose = require('mongoose')

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {});
        console.log("MONGODB CONNECTED");

        
    } catch (error) {
        console.error("Error connecting to mongodb ", error);
        process.exit(1);
        
    }
};

module.exports = connectDb;