require("dotenv").config();

module.exports = {
  url:
    "mongodb+srv://" +
    process.env.USER +
    ":" +
    process.env.PASSWORD +
    "@cluster0.7dsmg.mongodb.net/sample_restaurants?retryWrites=true&w=majority",
};
