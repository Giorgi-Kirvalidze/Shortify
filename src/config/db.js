const mongoose = require('mongoose')
const URL = process.env.DB_CONNECTION_URL
const connectionOptions = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
}
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(URL, connectionOptions)
        console.log(`mongoDB connected: ${conn.connection.host}`)
    } catch (e) {
        console.log(e.message)
        process.exit(1);
    }
}
connectDB()

