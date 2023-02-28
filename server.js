const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
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
    // postgresql-fitted-91316 is where the database is hosted (HEROKU)
    host: process.env.DATABASE_URL,
    ssl: true,
  },
});

// Environment variable
const PORT = process.env.PORT;

// app routes to port 3000
app.listen(PORT || 3000, () => {
  console.log(`Server is listening on port ${PORT}`);
});

// signin --> POST = success/fail
app.post("/signin", (req, res) => {
  signin.handleSignin(req, res, db, bcrypt);
});

// register --> POST = user
app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

// profile/:userId --> GET = user
app.get("/profile/:userId", (req, res) => {
  profile.handleProfileGet(req, res, db);
});

// image --> PUT --> user
app.put("/image", (req, res) => {
  image.handleImage(req, res, db);
});

// image --> POST --> img
app.post("/imageURL", (req, res) => {
  image.handleApiCall(req, res);
});

// root route
app.get("/", (req, res) => {
  res.send("This is the home page");
});
// => res = this is working
