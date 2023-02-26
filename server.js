const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");
// Controllers
const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const db = knex({
  client: "pg",
  connection: {
    // 127.0.0.1 is localhost
    host: "127.0.0.1",
    user: "eduard",
    password: "",
    database: "smart-brain",
  },
});

// signin --> POST = success/fail
app.post("/signin", (req, res) => {
  signin.handleSignin(req, res, db, bcrypt);
});

// register --> POST = user
app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

// app routes to localhost:3000
app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});

// profile/:userId --> GET = user
app.get("/profile/:userId", (req, res) => {
  profile.handleProfileGet(req, res, db);
});

// image --> PUT --> user
app.put("/image", (req, res) => {
  image.handleImage(req, res, db);
});

// root route
// => res = this is working
