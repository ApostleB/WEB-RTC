const messageList = document.querySelector ("ul");
const messageForm = document.querySelector("#message");
const nickForm = document.querySelector("#nickname");

const socket = new WebSocket(`ws://${window.location.host}`);

//메세지 형식 맞추기
const makeMessage = (type, payload) => {
    const msg = {type, payload}
    return JSON.stringify(msg);
}

const handleOpen = () => {
    console.log("socket open");
}
socket.addEventListener('open', handleOpen )

//메세지가 왔다!
socket.addEventListener('message', (message) => {
    const li = document.createElement("li");
    li.innerText = message.data;
    messageList.append(li);
    console.log("New Message : ", message.data); 
})

//서버와 통신이 끊겼다.
socket.addEventListener('close', () => {
    console.log("Disconnected Server");    
})

//메세지를 보내기
const handleSubmit = (e) => {
    e.preventDefault();
    const input = messageForm.querySelector('input');
    socket.send(makeMessage("new_message", input.value));
    const li = document.createElement("li");
    li.innerText = `You: ${input.value}`;
    messageList.append(li);
    input.value = "";
}

//닉네임에 대해서
const handleNickSubmit = (e) => {
    e.preventDefault();
    const input = nickForm.querySelector('input');
    socket.send(makeMessage("nickname", input.value));
    input.value = "";
}
messageForm.addEventListener('submit', handleSubmit)
nickForm.addEventListener("submit", handleNickSubmit)