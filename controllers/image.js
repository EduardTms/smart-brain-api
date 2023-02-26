const clarifai = require("clarifai");

const app = new Clarifai.App({
  apiKey: "6b2b48851e9544b7ac26df4c3e1fef24",
});

const handleApiCall = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => res.status(400).json("unable to work with api"));
};

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
  handleApiCall: handleApiCall,
};
