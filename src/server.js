/**
 * fileName       : server.js
 * author         : Yeong-Huns
 * date           : 2024-11-28
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2024-11-28        Yeong-Huns       최초 생성
 */

import express from "express";
import http from "http";
import io from "socket.io";


const app = express()

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use("/public", express.static(__dirname + "/public"))

app.get("/", (req, res) => res.render("home"));

const port = 3000

const httpServer = http.createServer(app);
const wsServer = io(httpServer);

wsServer.on("connection", (socket) => {
	//console.log(socket);
	socket.on("enterRoom", (roomName, callback) => {
		callback();
		socket.join(roomName);
		socket.to(roomName).emit("join");
	});
	socket.on("disconnecting", () => {
		socket.rooms.forEach(room => socket.to(room).emit("leave"));
	});
	socket.on("sendMessage", (value, room, callback) => {
		callback();
		socket.to(room).emit("sendMessage", value);
	})
});

const handleListen = () => console.log("3000번 포트에서 실행 중");
httpServer.listen(port, handleListen)