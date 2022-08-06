const express = require("express")
const app = express()
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const itemsRoutes = require("./routes/items")
const authRoutes = require("./routes/auth");
const messagesRoutes = require("./routes/messages")
const { generateRefreshToken, generateAccessToken } = require("./authValidation/generateTokens");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const cors = require("cors")

// config
dotenv.config();

mongoose 
 .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,  })   
 .then(() => console.log("Database connected!"))
 .catch(err => console.log(err));

// middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cors());
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin", "X-Requested-With", "Content-Type", "Accept")
	next();
});
  

// routes
app.use("/api/items", itemsRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/messages", messagesRoutes)


// JWT authentication
// if everything is ok, create new access token, refresh token and send to user
app.post("/api/refresh", async (req, res) => {
    //take the refresh token from the user
    // const refreshToken = req.body.token;
    console.log("Refreshing the accessToken as it expired")
    const userData = await User.findOne({email: req.body.user.email})
    const refreshToken = req.body.user.refreshToken;

    //send error if there is no token or it's invalid
    if (refreshToken.length <= 1) {
      return res.status(401).json("Refresh token is not valid!");
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
		err && console.log(err);

		const currentUser = {id: req.body.user._id, username: req.body.user.username, email: req.body.user.email};
		const newAccessToken = generateAccessToken(currentUser);
		const newRefreshToken = generateRefreshToken(currentUser);

		await userData.updateOne({$set: {refreshToken: newRefreshToken}});

		return res.status(200).json({
			accessToken: newAccessToken,
			refreshToken: newRefreshToken,
		});

    });
});


const PORT = process.env.PORT || 8800;

// -------------------------- Production ---------------------------
// const __dirname1 = path.resolve();
// if (process.env.NODE_ENV === "production") {
// 	app.use(express.static(path.join(__dirname1, "/frontend/build")));

// 	app.get('*', (req, res) => {
// 		res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
// 	});
// }
// else {
// 	app.get("/", (req, res) => {
// 		res.send("API is Running Successfully");
// 	})
// }

// ------------------------ X ------- X ------- X ----------


// start server
const server = app.listen(PORT, () => {
    console.log("Backend server is running")
})


// socket.io
const io = require("socket.io")(server, {
	pingTimeout: 60000,
	transports: ['websocket', 'polling', 'flashsocket'],
	cors: {
		origin: ['*:*'],
		allowedHeaders: [
			"Access-Control-Allow-Headers",
			"Access-Control-Allow-Origin",
			"X-Requested-With",
			"X-Access-Token",
			"Content-Type",
			"Host",
			"Accept",
			"Connection",
			"Cache-Control",
		],
		credentials: true,
	},
});

io.on("connection", (socket) => {
	// socket connected
	console.log("socket connected")

	// join room 
	socket.on('join-room', (roomId) => {
		console.log("User joined the room " + roomId)
		socket.join(roomId)
	})

	// send a message 
	socket.on('send-message', (senderId, senderEmail, roomId, message) => {
		const data = {senderId, senderEmail, roomId, message}
		socket.to(roomId).emit('get-message', data)
	})

})


