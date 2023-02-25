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
  const { email, name, password } = req.body;
  const hash = bcrypt.hashSync(password);
  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        return trx("users")
          .returning("*")
          .insert({
            email: email,
            name: name,
            joined: new Date(),
          })
          .then((user) => {
            res.json(user[0]);
          });
      })
      // if everything goes well, return the newly created user
      .then(trx.commit)
      // if something goes wrong, rollback
      .catch(trx.rollback);
  }).catch((err) => {
    res.status(400).json("Unable to register user");
  });
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
      res.json(entries[0].entries);
    })
    .catch((err) => {
      res.status(400).json("error getting user");
    });
});

// root route
// => res = this is working
