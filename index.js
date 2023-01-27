const express = require('express')
const dotenv = require('dotenv')
const authRouter = require('./routers/authRouter')
const postsRouter = require('./routers/postsRouter')
const userRouter = require('./routers/userRouter')
const dbconnect = require('./dbConnect')
const morgan = require("morgan")
const cookie = require('cookie-parser')
const cors = require("cors")
const cloudinary = require("cloudinary").v2;

dotenv.config('./server\.env') 

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();

// middlewares
app.use(express.json({ limit: "10mb" }))
app.use(morgan("common"))
app.use(cookie())

let origin = "http://localhost:3000";
console.log("here env", process.env.NODE_ENV);
if(process.env.NODE_ENV === 'production'){
    origin = process.env.CLIENT_ORIGIN
}

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}))


app.use('/auth', authRouter)
app.use('/posts', postsRouter)
app.use('/user', userRouter)


app.get('/', (req, res) => {
    res.status(200).send("server is live")
})
const Port = process.env.PORT
dbconnect()

app.listen(Port, () => {
    console.log("listening on " + Port);
})