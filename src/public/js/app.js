const socket = io();

const enter = document.querySelector("#enter");
const form = enter.querySelector("form");
const room = document.querySelector("#room");
const nick = document.querySelector("#nick");

room.hidden = true;
nick.hidden = true;

let roomName;
let nickName = "익명"

function showRoom(){
	nick.hidden = true;
	room.hidden = false;

	const form = room.querySelector("form");
	announceMessage(`새로운 채팅방에 참여하였습니다.`);
	form.addEventListener("submit", handleMessageSubmit);
}

function showNick(memberCount){
	enter.hidden = true;
	nick.hidden = false;
	const h3 = room.querySelector("h3");
	h3.innerText = `채팅방 이름: ${roomName} (${memberCount})`
	const form = nick.querySelector("form");
	form.addEventListener("submit" , handleNickSubmit);
}

function addMessage(message){
	const ul = room.querySelector("ul");
	const li = document.createElement("li");
	li.innerText = message;
	ul.appendChild(li);
}

function announceMessage(message){
	const ul = room.querySelector("ul");
	const li = document.createElement("li");
	li.className = "text-md text-gray-400";
	li.innerText = message;
	ul.appendChild(li);
}

function handleNickSubmit(event){
	event.preventDefault();
	const form = nick.querySelector("form");
	const input = form.querySelector("input");
	nickName = input.value;
	socket.emit("nickName", roomName, nickName, showRoom);
	input.value = "";
}

function handleEnterRoom(event){
	event.preventDefault();
	const input = form.querySelector("input");
	roomName = input.value;
	socket.emit("enterRoom", roomName, (memberCount) => showNick(memberCount));
	input.value = "";
}

function handleMessageSubmit(event){
	event.preventDefault();
	const form = room.querySelector("form");
	const input = form.querySelector("input");
	const value = input.value;
	socket.emit("sendMessage", value, roomName, () => {
		addMessage(`나 : ${ value }`);
	})
	input.value = "";
}


form.addEventListener("submit",handleEnterRoom);

socket.on("join", memberCount => {
	const h3 = room.querySelector('h3');
	//console.log(`멤버카운트 ${memberCount}`)
	h3.innerText = `채팅방 이름: ${roomName} (${memberCount})`
});

socket.on("nickName", (nickName)=> {
	announceMessage(`${nickName}님이 채팅방에 참여하였습니다.`);
});

socket.on("leave", (nickName, memberCount) => {
	announceMessage(`${nickName}님이 채팅방에서 퇴장하셨습니다.`)
	const h3 = room.querySelector('h3');
	if(!memberCount) h3.innerText = `채팅방 이름: ${roomName}`
	else h3.innerText = `채팅방 이름: ${roomName} (${memberCount})`
});

socket.on("sendMessage", (message) => {
	addMessage(`${message.nickName}: ${message.msg}`);
})

socket.on("room_announce", (rooms) => {
	//console.log(rooms);
	const roomList = enter.querySelector('ul')
	roomList.innerHTML = '';
	if(rooms.length === 0) {
		return;
	}
	rooms.forEach((room) => {
		const li = document.createElement('li');
		li.innerText = room;
		roomList.append(li);
	})
})