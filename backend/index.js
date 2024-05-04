const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectToDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();
const port = 5000;

dotenv.config();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

connectToDB();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

let connectionMap = {};

io.on("connection", async (socket) => {
  console.log("Connected to socket.io:", socket.id);

  socket.on("initial-data", (userId) => {
    if (userId && userId.length > 0) {
      if (!connectionMap[userId]) {
        connectionMap[userId] = [];
      }
      connectionMap[userId].push(socket.id);
    }
  });

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined room: " + room);
  });

  socket.on("new message", (newMessage) => {
    socket.to(newMessage.chat._id).emit("message received", newMessage);
  });

  socket.on("new group", (newGroup) => {
    newGroup.users.map((user) => {
      if (connectionMap[user._id]) {
        connectionMap[user._id].forEach((socketId) => {
          io.sockets.sockets.get(socketId).join(newGroup._id);
          socket.to(socketId).emit("group created", newGroup);
        });
      }
    });
  });

  socket.on("group change", (newGroup) => {
    socket.to(newGroup._id).emit("group changed", newGroup);
  });

  socket.on("group delete", (groupId) => {
    socket.to(groupId).emit("group deleted", groupId);
  });

  socket.on("user add", (data) => {
    const { userId, newGroup } = data;
    if (connectionMap[userId]) {
      connectionMap[userId].forEach((socketId) => {
        io.sockets.sockets.get(socketId).join(newGroup._id)
        socket.to(socketId).emit("user added", newGroup);
      })
    }
  });

  socket.on("user remove", (data) => {
    const { userId, chatId } = data;
    if (connectionMap[userId]) {
      socket.to(connectionMap[userId]).emit("user removed", chatId);
    }
  });

  socket.on("disconnect", () => {
    Object.keys(connectionMap).forEach((userId) => {
      connectionMap[userId] = connectionMap[userId].filter(
        (id) => id !== socket.id
      );
      if (connectionMap[userId].length === 0) {
        delete connectionMap[userId];
      }
    });
  });
});
