const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require('./routes/messageRoutes')
const path = require("path");
const { notFound, OtherErrorHandler } = require('./middlewares/errorMiddlewares')
dotenv.config();
connectDB()

const app = express();
app.use(express.json());
app.use('/api/user', userRoutes)
app.use('/api/chats', chatRoutes)
app.use('/api/message', messageRoutes)

// --------------------------deployment------------------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

// --------------------------deployment------------------------------

app.use(notFound)
app.use(OtherErrorHandler)

const server = app.listen(process.env.PORT, console.log(`Server started on PORT ${process.env.PORT}`))

const io = require('socket.io')(server, {
    // amount of time it will wait without being inactive / close connection after given time
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
    }
})

io.on("connection", (socket) => {
    socket.on('setup', (userData) => {
        //   create new room for user id
        socket.join(userData._id);
        socket.emit("connected")
    })

    socket.on('join chat', (room) => {
        socket.join(room)
    })

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMsg) => {
        console.log("new message received to socket")
        var chat = newMsg.chat; //get which chat it belongs;
        if (!chat.users) return 
        chat.users.forEach(user => {
            if (user._id == newMsg.sender._id) return;
            socket.in(user._id).emit("message received", newMsg);  //sending new msg to user logged in
        });

    })

    socket.on("group_chat_updated", (data) => {
        const { chatId } = data;
        socket.to(chatId).emit("group_chat_updated",data);
    });

    socket.off('setup',()=>{
        socket.leave(userData._id)
    })

})
