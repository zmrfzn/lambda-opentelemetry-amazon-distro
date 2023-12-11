const serverless = require("serverless-http");
const express = require("express");
const bodyParser = require('body-parser')

const app = express();
app.use(bodyParser.json())


app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from root!",
  });
});

app.get("/path", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from path!",
  });
});

// express post call to / and response with payload body if type is json and contains the key message or default to "Hello" 
app.post("/", (req, res, next) => {
  const message = req.body.message || "Hello from POST";
  return res.status(200).json({
    message: message,
  });
});

const API_CONFIG = {
  baseURL: process.env.EXPRESS_OTEL_API_ENDPOINT
};

app.get("/weather", (req, res) => {
  var axios = require("axios");

  var config = {
    method: "get",
    url: `${API_CONFIG.baseURL}/weather?location=${req.query.location}`,
    headers: {
      "Content-Type": "application/json",
    },
  };

  axios(config)
    .then(function (response) {
      console.info(
        `${req.method} ${req.originalUrl}- ${JSON.stringify(
          req.params
        )} - Request Successful!!`
      );
      res.send(response.data);
    })
    .catch(function (error) {
      console.error(
        `${req.method} ${req.originalUrl}- ${JSON.stringify(
          req.params
        )} - Error fetching data`
      );
      res
        .status(404)
        .send({ message: "Error retrieving data for location=" + req.params?.location });
    });
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
