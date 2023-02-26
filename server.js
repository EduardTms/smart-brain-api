const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");
// Controllers
const register = require("./controllers/register");

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
  db.select("email", "hash")
    .from("login")
    .where("email", "=", req.body.email)
    .then((data) => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", req.body.email)
          .then((user) => {
            res.json(user[0]);
          })
          .catch((err) => res.status(400).json("unable to find user"));
      } else {
        res.status(400).json("invalid credentials");
      }
    })
    .catch((err) => res.status(400).json("wrong credentials"));
});

// register --> POST = user
app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});

// profile/:userId --> GET = user
app.get("/profile/:userId", (req, res) => {
  const { userId } = req.params;
  db.select("*")
    .from("users")
    .where({ id: userId })
    .then((user) => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(404).send("User not found");
      }
    })
    .catch((err) => {
      res.status(400).json("error getting user");
    });
});

// image --> PUT --> user
app.put("/image", (req, res) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      // not entirely sure if this is the best way to do this, but it works
      res.json(entries[0].entries);
    })
    .catch((err) => {
      res.status(400).json("error getting user");
    });
});

// root route
// => res = this is working
