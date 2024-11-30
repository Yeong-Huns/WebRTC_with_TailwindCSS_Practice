/*
//alert("public/js/app.js")

//const socket = new WebSocket("http://localhost:3000");

const messageList = document.querySelector("ul");
/!*const messageForm = document.querySelector("form");*!/

const nickNameForm = document.querySelector("#nick");
const messageForm = document.querySelector("#message");

const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", ()=>{
	console.log("웹소켓이 연결되었습니다.")
});

socket.addEventListener("message", (message)=>{
	console.log(`받은 메세지: ${message.data}`);
	const li = document.createElement("li");
	li.innerText = message.data;
	messageList.append(li);
})

socket.addEventListener("close", ()=>{
	console.log("웹소켓 연결이 해제되었습니다.");
})

/!**
 * @description 메세지를 입력받아 웹소켓으로 전송하는 함수
 *!/
function handleSubmit(event){
	event.preventDefault();
	const input = messageForm.querySelector("input");
	//socket.send(input.value);
	socket.send(makeMessage("message", input.value));
	input.value = "";
}

/!**
 * @description 닉네임을 입력받아 웹소켓으로 전송하는 함수
 *!/
function handleNickNameSubmit(event){
	event.preventDefault();
	const input = nickNameForm.querySelector("input");
	//socket.send(input.value);
	socket.send(makeMessage("nickName", input.value));
	input.value = "";
}

/!**
 * @description json 문자열 변환
 *!/
const makeMessage = (type, payload) => JSON.stringify({type, payload});

messageForm.addEventListener("submit", handleSubmit);
nickNameForm.addEventListener("submit", handleNickNameSubmit);
*/

const socket = io();

const enter = document.querySelector("#enter");
const form = enter.querySelector("form");
const room = document.querySelector("#room");


room.hidden = true;

let roomName;

function showRoom(){
	enter.hidden = true;
	room.hidden = false;
	const h3 = room.querySelector("h3");
	h3.innerText = `채팅방 이름: ${roomName}`
	const form = room.querySelector("form");
	form.addEventListener("submit", handleMessageSubmit);
}

function handleEnterRoom(event){
	event.preventDefault();
	const input = form.querySelector("input");
	socket.emit("enterRoom", input.value, showRoom);
	roomName = input.value;
	input.value = "";
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

socket.on("join", ()=> {
	announceMessage("익명님이 채팅방에 참여하였습니다.");
});

socket.on("leave", () => {
	announceMessage("익명님이 채팅방에서 퇴장하셨습니다.")
});

socket.on("sendMessage", (msg) => {
	addMessage(`익명: ${msg}`);
})