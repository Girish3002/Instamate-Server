const mongoose = require('mongoose')

module.exports = async () => {
    const mongoURI = 'mongodb+srv://Girish:Shubham%4098@cluster0.erx0bre.mongodb.net/?retryWrites=true&w=majority'

    try {

        const connect = await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log(`Mongodb connected ${connect.connection.host}`)
    }

    catch (e) {
        console.log(e);
        process.exit(1)

    }
}

