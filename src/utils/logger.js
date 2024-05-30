const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, "logs");
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

// Create a write stream for logging
const accessLogStream = fs.createWriteStream(
    path.join(logsDir, `${new Date().toISOString().slice(0, 10)}.log`),
    { flags: "a" }
);


const logger = morgan('combined', { stream: accessLogStream});

module.exports = logger;