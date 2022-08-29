const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const session = require('express-session');
require('dotenv').config();

const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: 'http://localhost:3000' } });

mongoose
  .connect(process.env.MONGO_KEY)
  .then((res) => {
    console.log('all good, database connected');
  })
  .catch((e) => {
    console.log(e);
  });

io.on('connect', (socket) => {
  socket.on('message', (payload) => {
    // message
  });

  socket.on('disconnect', () => {
    // disconnect
  });
});

app.set('socketio', io);

app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  })
);

app.use(express.json());
server.listen(4000);

const router = require('./src/router/mainRouter');
app.use('/', router);
