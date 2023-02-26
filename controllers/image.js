const handleImage = (req, res) => {
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
};

module.exports = {
  handleImage: handleImage,
};
