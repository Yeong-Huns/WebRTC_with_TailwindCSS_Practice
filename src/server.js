import express from 'express';
import http from "http";
import WebSocket from 'ws'

/**
 * fileName       : server.js
 * author         : Yeong-Huns
 * date           : 2024-11-28
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2024-11-28        Yeong-Huns       최초 생성
 */


//console.log("Hello World")

const app = express()

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use("/public", express.static(__dirname + "/public"))

app.get("/", (req, res) => res.render("home"));


const handleListen = () => {
	console.log('3000번 포트에서 실행중');
	console.log(__dirname); //C:\WebRTC_practice_project\src
};
const port = 3000
//app.listen(port, handleListen);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// const handleConnection = (socket) => console.log(socket);

const sockets = [];

wss.on("connection", (socket)=> {
	sockets.push(socket);
	console.log("브라우저와 연결됨");
	socket.on("close", () => console.log("브라우저와 연결 해제됨."));
	socket.on("message", (message) => {
		console.log(message.toString());
		//socket.send(message.toString());
		sockets.forEach(existSocket => existSocket.send(`${message}`));
	});

});

server.listen(port, handleListen)