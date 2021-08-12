require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const userRoutes = require('./routes/user');
const checksRouters = require('./routes/checks');
const app = express();

app.use(express.json());


module.exports = app;

const User = require("./models/user");
const Hashes = require("./models/hashes");
const auth = require("./middleware/auth");

app.post("/welcome", auth, (req, res) => {
  res.status(200).send("Welcome 🙌 ");
});


app.use('/user', userRoutes);
app.use('/check', checksRouters);