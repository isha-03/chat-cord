const path=require('path');
const express= require('express');
const http=require('http');
const socketio=require('socket.io');
const formatMessages=require('./utils/messages');
const app=express();
const server=http.createServer(app);
const io=socketio(server);
const botName='Chatcord Bot';
const {userJoin,getCurrentUser,userLeave,getRoom}=require('./utils/users');
app.use(express.static(path.join(__dirname,'public')));
//in the above line we made public a static folder __dirname means current directory

//run when client connects
io.on('connection',socket=>{
    socket.on('joinRoom',({username,room})=>{
        const user=userJoin(socket.id,username,room);
        socket.join(user.room);
        socket.emit('message',formatMessages(botName,'welcome to chatcord!'));
        socket.broadcast.to(user.room).emit('message',formatMessages(botName,`${user.username} has joined the chat`));
        io.to(user.room).emit('roomUsers',{
            room: user.room,
            users: getRoom(user.room)
        });
        socket.on('chatMessage',(msg)=>{
            const user=getCurrentUser(socket.id);
            io.to(user.room).emit('message',formatMessages(user.username,msg));
        })
        socket.on('disconnect',()=>{
            const user=userLeave(socket.id);
            if(user){
                io.to(user.room).emit('message',formatMessages(botName,`${user.username} has left the chat`));
                io.to(user.room).emit('roomUsers',{
                    room: user.room,
                    users: getRoom(user.room)
                });
            }
            
        })

    })
});

const PORT=3000;
server.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`)
});