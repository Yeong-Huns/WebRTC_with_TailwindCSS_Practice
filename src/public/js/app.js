//alert("public/js/app.js")

//const socket = new WebSocket("http://localhost:3000");

const messageList = document.querySelector("ul");
const messageForm = document.querySelector("form");
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

/*setTimeout(() => {
	socket.send("브라우저 -> 서버로 메세지 전송함");
}, 5000);*/

function handleSubmit(event){
	event.preventDefault();
	const input = messageForm.querySelector("input");
	socket.send(input.value);
	input.value = "";
}

messageForm.addEventListener("submit", handleSubmit);