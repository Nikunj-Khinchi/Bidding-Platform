const http = require('http');
const socketIo = require('socket.io');
const app = require('./src/app');
const dotenv = require('dotenv');
const sequelize = require("./src/config/database");
const cors = require('cors');
const { handleSocket } = require('./src/config/socket');
dotenv.config();

app.use(cors());
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
    }
});


io.on('connection', (socket) => {
    app.set('socket', socket);
    console.log('New client connected');
    handleSocket(socket, io);
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});


sequelize
  .sync()
  .then(() => {
    console.log("Database synchronized");
  })
  .catch((err) => {
    console.error("Error synchronizing the database:" ,err.message);
  });


const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = { server, io };