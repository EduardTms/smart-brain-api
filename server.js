const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "eduard",
    password: "",
    database: "smart-brain",
  },
});

const database = {
  users: [
    {
      id: 1,
      username: "Eduard",
      email: "eduard@yahoo.com",
      password: "admin",
      entries: 5,
      joined: new Date(),
    },
    {
      id: 2,
      username: "Andrei",
      email: "Andrei@example.com",
      password: "admin2",
      entries: 0,
      joined: new Date(),
    },
  ],
  login: [
    {
      id: "3",
      has: "",
      email: "eduard@yahoo.com",
    },
  ],
};

app.get("/", (req, res) => {
  res.send(database.users);
});

// signin --> POST = success/fail
app.post("/signin", (req, res) => {
  // Load hash from your password DB.
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json(database.users[0]);
  } else {
    res.status(401).send("Invalid credentials");
  }
});

// register --> POST = user
app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  db("users")
    .returning("*")
    .insert({
      email: email,
      name: name,
      joined: new Date(),
    })
    .then((user) => {
      res.json(user[0]);
    })
    .catch((err) => {
      res.status(400).json("Unable to register user");
    });
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});

// profile/:userId --> GET = user
app.get("/profile/:userId", (req, res) => {
  const { userId } = req.params;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === Number(userId)) {
      found = true;
      return res.json(user);
    }
  });
  if (!found) {
    res.status(404).send("User not found");
  }
});

// image --> PUT --> user
app.put("/image", (req, res) => {
  let found = false;
  database.users.forEach((user) => {
    if (user.id === Number(req.body.id)) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });
  if (!found) {
    res.status(404).send("User not found");
  }
});

// root route
// => res = this is working
