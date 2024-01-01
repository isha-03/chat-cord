const chatForm= document.getElementById('chat-form');
const chatMessages=document.querySelector('chat-messages');
const socket=io();

//get username and roomname from url
const {username, room}=Qs.parse(location.search,{
    ignoreQueryPrefix: true
    //we use this to erase all the symbols adjoined to the info required like ?username/..
});

//join chatroom
socket.emit('joinRoom',{username,room});

socket.on('message',message=>{
    console.log(message);
    outputMessage(message);
    chatMessages.scrollTop=chatMessages.scrollHeight;
})
socket.on('roomUsers',({room,users})=>{
    outputRoomName(room);
    outputUsers(users);
})
// socket.on('chat',message=>{
    
//     //scroll down automatically when messages exceed the window height
//     chatMessages.scrollTop=chatMessages.scrollHeight;
// })
chatForm.addEventListener('submit',(e)=>
{
    e.preventDefault();
    //when you submit a form it automatically submits to a file so to prevent it we use preventDefault
    const msg=e.target.elements.msg.value;
    socket.emit('chatMessage',msg);
    e.target.elements.msg.value='';
    e.target.elements.msg.focus();
})
function outputMessage(msg){
    const div=document.createElement('div');
    div.classList.add('message');
    div.innerHTML=`<p class="meta">${msg.username}<span>${msg.time}</span></p>
    <p class="text">
      ${msg.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}
function outputRoomName(room){
    const roomName=document.getElementById('room-name');
    roomName.innerText=room;
}
function outputUsers(users){
    const userList=document.getElementById('users');
    
    userList.innerHTML=`
    ${users.map(user=>`<li>${user.username}</li>`).join('')}
    `
}