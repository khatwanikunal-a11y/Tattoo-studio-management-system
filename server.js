require('dotenv').config();
const { createApp } = require('./app');
const connectDB = require('./config/db');


app.listen(3000, function () {
    process.stdout.write('Server running on http://127.0.0.1:3000\n');
  }
);