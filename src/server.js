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
import {Server} from "socket.io";
import {instrument} from "@socket.io/admin-ui";

const app = express()

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use("/public", express.static(__dirname + "/public"))

app.get("/", (req, res) => res.render("home"));

const port = 3000

const httpServer = http.createServer(app);
const wsServer = new Server(httpServer, {
	cors: {
		origin: ["https://admin.socket.io"],
		credentials: true
	}
});

instrument(wsServer, {
	auth: false
})

/**
 * @description 공용 채팅방을 반환하는 함수
 * @returns {string []}
 */
function publicRooms() {
	/*const sids = wsServer.sockets.adapter.sids;
	const rooms = wsServer.sockets.adapter.rooms;*/

	const {
		sockets: {
			adapter: {sids, rooms}
		}
	} = wsServer; // 구조 분해 할당

	const publicRooms = [];
	rooms.forEach((_, key) => {
		if (!sids.get(key)) {
			publicRooms.push(key)
		}
	})
	return publicRooms;
}

function countMember(roomName){
	return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

wsServer.on("connection", (socket) => {
	//console.log(socket);
	socket["nickName"] = "익명";
	socket.onAny((event) => {
		const rooms = wsServer.sockets.adapter.rooms;
		const sids = wsServer.sockets.adapter.sids;
		/*console.log('SIDS: ===')
		console.log(sids)
		console.log('rooms: ===')
		console.log(rooms)*/
		//console.log(`소켓 이벤트 : ${event}`);
	})
	socket.on("enterRoom", (roomName, callback) => {
		socket.join(roomName);
		const memberCount = countMember(roomName);
		callback(memberCount);
		socket.to(roomName).emit("join", countMember(roomName)); // 채팅방의 다른사람들에게 보냄
		//socket.emit("join", countMember(roomName)); // 나에게 보냄
		wsServer.sockets.emit("room_announce", publicRooms());
	});
	socket.on("nickName", (roomName, nickName, callback) => {
		callback();
		socket["nickName"] = nickName;
		socket.to(roomName).emit("nickName", nickName)
	});
	socket.on("disconnecting", () => { // disconnecting : 연결이 해제되기 직전에 발생하는 이벤트
		socket.rooms.forEach(room => socket.to(room).emit("leave", socket.nickName, countMember(room) - 1));
	});
	socket.on("disconnect", () => { // disconnect : 연결이 완전히 해제되면 발생하는 이벤트
		wsServer.sockets.emit("room_announce", publicRooms());
	})
	socket.on("sendMessage", (value, room, callback) => {
		//console.log(socket.nickName);
		const message = {
			nickName: socket.nickName,
			msg: value
		}
		socket.to(room).emit("sendMessage", message);
		callback();
	})
});

const handleListen = () => console.log("3000번 포트에서 실행 중");
httpServer.listen(port, handleListen)