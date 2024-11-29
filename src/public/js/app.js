//alert("public/js/app.js")

//const socket = new WebSocket("http://localhost:3000");

const messageList = document.querySelector("ul");
/*const messageForm = document.querySelector("form");*/

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

/**
 * @description 메세지를 입력받아 웹소켓으로 전송하는 함수
 */
function handleSubmit(event){
	event.preventDefault();
	const input = messageForm.querySelector("input");
	//socket.send(input.value);
	socket.send(makeMessage("message", input.value));
	input.value = "";
}

/**
 * @description 닉네임을 입력받아 웹소켓으로 전송하는 함수
 */
function handleNickNameSubmit(event){
	event.preventDefault();
	const input = nickNameForm.querySelector("input");
	//socket.send(input.value);
	socket.send(makeMessage("nickName", input.value));
	input.value = "";
}

/**
 * @description json 문자열 변환
 */
const makeMessage = (type, payload) => JSON.stringify({type, payload});

messageForm.addEventListener("submit", handleSubmit);
nickNameForm.addEventListener("submit", handleNickNameSubmit);
