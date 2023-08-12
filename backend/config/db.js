const mongoose = require('mongoose')

const connectDB = async () => {
    console.log("trying to connect")
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI)
        console.log("connection success")
    }
    catch (error) {
        console.error(`Error Received ${error.message}`)
    }
}
module.exports = connectDB
