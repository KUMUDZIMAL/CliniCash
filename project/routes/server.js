const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors')
const app = express();
const server = createServer(app);
const io = new Server(server); // Create the Socket.IO server

app.use(cors())

const allusers = {}; // Object to store user data

// Serve static files from the "public" folder
app.use(express.static("public"));

// Handle incoming HTTP requests
app.get("/video", (req, res) => {
    res.render('index'); // Serve the index.html file
});

// Handle socket connections
io.on("connection", (socket) => {
    console.log(`User connected with socket ID: ${socket.id}`);

    socket.on("join-user", (username) => {
        console.log(`${username} joined`);
        allusers[username] = { username, id: socket.id };
        io.emit("joined", allusers); // Emit to all users
    });

    socket.on("disconnect", () => {
        // Remove user from allusers on disconnect
        for (const username in allusers) {
            if (allusers[username].id === socket.id) {
                delete allusers[username];
                break;
            }
        }
        io.emit("joined", allusers); // Emit updated user list
    });

    socket.on("offer", ({ from, to, offer }) => {
        if (allusers[to]) {
            io.to(allusers[to].id).emit("offer", { from, to, offer });
        } else {
            console.error(`User ${to} not found`);
        }
    });

    socket.on("answer", ({ from, to, answer }) => {
        if (allusers[from]) {
            io.to(allusers[from].id).emit("answer", { from, to, answer });
        } else {
            console.error(`User ${from} not found`);
        }
    });

    socket.on("icecandidate", (candidate) => {
        socket.broadcast.emit("icecandidate", candidate);
    });
});
 module.exports=app;