const mongoose = require("mongoose")


async function connectToDB() {
    const uri = process.env.MONGO_URI

    if (!uri) {
        console.error("MONGO_URI is not set. Please configure your .env file.")
        throw new Error("MONGO_URI not defined")
    }

    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        console.log("Connected to Database")
    }
    catch (err) {
        console.error("Failed to connect to MongoDB:", err)
        throw err
    }
}

module.exports = connectToDB