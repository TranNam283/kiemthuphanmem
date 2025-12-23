import connectDB from "./config/connectDB";
import http from "http";
import { sendMessage } from "./services/messageService";
import app from "./app";
require("dotenv").config();
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const server = http.createServer(app);

const socketIo = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
socketIo.on("connection", (socket) => {
  // console.log("New client connected" + socket.id);

  socket.on("sendDataClient", function (data) {
    sendMessage(data);
    socketIo.emit("sendDataServer", { data });
  });
  socket.on("loadRoomClient", function (data) {
    socketIo.emit("loadRoomServer", { data });
  });
  socket.on("disconnect", () => {
    // console.log("Client disconnected");
  });
});
let port = process.env.PORT || 8004;

connectDB();

server.listen(port, () => {
  console.log("Backend Nodejs is running on the port : " + port);
});
