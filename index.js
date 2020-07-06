const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { mongourl } = require('./config/key');
require('./models/Users');
const authRoutes = require('./routes/authRoutes');
const app = express();
const port = 3000;

mongoose.connect(mongourl, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected', () => {
  console.log('connected to mongo');
});
mongoose.connection.on('error', (err) => {
  console.log('Error: ', err);
});

app.use(bodyParser.json());
app.use(authRoutes);

app.listen(port, () => {
  console.log('server running on port' + port);
});
