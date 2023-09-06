const serverless = require("serverless-http");
const express = require("express");
const app = express();

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

const API_CONFIG = {
  baseURL: "http://api.openweathermap.org/data/2.5",
  TOKEN: "b06f7aeeae13ab893ca5409afa2ca384",
};

app.get("/weather", (req, res) => {
  var axios = require("axios");

  var config = {
    method: "get",
    url: `${API_CONFIG.baseURL}/weather?q=${req.query.location}&appid=${API_CONFIG.TOKEN}`,
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
