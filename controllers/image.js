const Clarifai = require("clarifai");

const app = new Clarifai.App({
  apiKey: "2ee21aaf86de4a07ba1402e145d6af85",
});

const handleApiCall = (req, res) => {
  // Sometimes the Clarifai Models can be down or not working as they are constantly getting updated.
  // If that isn't working, then that means we have to wait until their servers are back up.

  // Old Way:
  // app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)

  // New Way:
  app.models
    .predict(
      {
        id: "face-detection",
        name: "face-detection",
        version: "6dc7e46bc9124c5c8824be4822abe105",
        type: "visual-detector",
      },
      req.body.input
    )
    .then((data) => {
      res.json(data);
    })
    .catch((err) => res.status(400).json("unable to work with API"));
};

const handleImage = (req, res, db) => {
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
