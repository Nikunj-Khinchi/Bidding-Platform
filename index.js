const http = require('http');
const socketIo = require('socket.io');
const app = require('./src/app');
const dotenv = require('dotenv');
const sequelize = require("./src/config/database");

// const { handleSocket } = require('./src/config/socket');
dotenv.config();


const server = http.createServer(app);
const io = socketIo(server);

// io.on('connection', (socket) => {
//     console.log('New client connected');
//     handleSocket(socket, io);
//     socket.on('disconnect', () => {
//         console.log('Client disconnected');
//     });
// });


sequelize
  .sync()
  .then(() => {
    console.log("Database synchronized");
  })
  .catch((err) => {
    console.error("Error synchronizing the database:" ,err.message);
  });


const PORT = 3001;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
