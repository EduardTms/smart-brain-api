const handleRegister = (req, res, db, bcrypt) => {
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
};

module.exports = {
  handleRegister: handleRegister,
};
