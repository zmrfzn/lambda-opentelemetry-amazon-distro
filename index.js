const serverless = require("serverless-http");
const express = require("express");
const bodyParser = require('body-parser');
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

// Helper function for micro tasks
const performMicroTasks = async () => {
  const tasks = [];
  
  // Task 1: Generate random number
  const randomNum = Math.floor(Math.random() * 1000);
  tasks.push({ task: 'random_number', result: randomNum });
  
  // Task 2: Current timestamp
  const timestamp = new Date().toISOString();
  tasks.push({ task: 'timestamp', result: timestamp });
  
  // Task 3: Simple calculation
  const calculation = Math.pow(randomNum, 2) / 100;
  tasks.push({ task: 'calculation', result: calculation });
  
  // Task 4: String manipulation
  const stringTask = `Task_${randomNum}_${timestamp.slice(-8)}`;
  tasks.push({ task: 'string_manipulation', result: stringTask });
  
  // Task 5: Array operation
  const arrayTask = Array.from({ length: 5 }, (_, i) => randomNum + i);
  tasks.push({ task: 'array_operation', result: arrayTask });
  
  return tasks;
};

app.get("/", async (req, res, next) => {
  try {
    const microTasks = await performMicroTasks();
    
    return res.status(200).json({
      message: "Hello from root!",
      microTasks: microTasks,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in root route:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get("/path", async (req, res, next) => {
  try {
    const microTasks = await performMicroTasks();
    
    return res.status(200).json({
      message: "Hello from path!",
      microTasks: microTasks,
      path: req.path,
      query: req.query
    });
  } catch (error) {
    console.error('Error in path route:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// express post call to / and response with payload body if type is json and contains the key message or default to "Hello" 
app.post("/", async (req, res, next) => {
  try {
    const message = req.body.message || "Hello from POST";
    const microTasks = await performMicroTasks();
    
    return res.status(200).json({
      message: message,
      microTasks: microTasks
    });
  } catch (error) {
    console.error('Error in POST route:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Updated weather route to call catfacts instead
app.get("/randomcatfacts", async (req, res) => {
  try {
    // add logs
    console.log("in /randomcatfacts route");
    // Call the catfacts function instead of external weather API
    const apiGatewayBaseUrl = process.env.API_GATEWAY_BASE_URL;
    
    if (!apiGatewayBaseUrl) {
      return res.status(500).json({ 
        error: "API Gateway base URL not configured",
        message: "Please check environment variables"
      });
    }

    let catfactsResponse;
    
    // Production - call the API Gateway endpoint
    const config = {
      method: "get",
      url: `${apiGatewayBaseUrl}/catfacts`,
      headers: {
        "Content-Type": "application/json",
      },
    };
    console.log("invoking catfacts API Gateway endpoint:", config.url);
    catfactsResponse = await axios(config);
    
    console.log("catfacts function response", catfactsResponse.data);
    
    console.info(
      `${req.method} ${req.originalUrl}- ${JSON.stringify(
        req.params
      )} - Request Successful!!`
    );
    
    res.json({
      ...catfactsResponse.data,
      originalLocation: req.query.location || 'unknown',
      service: 'weather-to-catfacts-adapter'
    });
    
  } catch (error) {
    console.error(
      `${req.method} ${req.originalUrl}- ${JSON.stringify(
        req.params
      )} - Error fetching data:`, error.message
    );
    res.status(404).json({ 
      message: "Error retrieving cat facts",
      error: error.message,
      originalLocation: req.query.location || 'unknown'
    });
  }
});

app.get("/multihop", async (req, res) => {
    // call subtasks then catfacts then microtasks and log the response
    console.log("calling multihop route");
    const subtasksResponse = await axios.get(`${process.env.API_GATEWAY_BASE_URL}/subtasks`);
    const catfactsResponse = await axios.get(`${process.env.API_GATEWAY_BASE_URL}/catfacts`);
    const microtasksResponse = await axios.get(`${process.env.API_GATEWAY_BASE_URL}/microtasks`);

    
    res.json({
      subtasks: subtasksResponse.data,
      catfacts: catfactsResponse.data,
      microtasks: microtasksResponse.data,
      service: 'multihop-service'
    });
});

app.get("/microtasks", async (req, res) => {
  const microTasks = await performMicroTasks();
  res.json({
    microTasks: microTasks
  });
});

// New subtasks route
app.get("/complex-tasks", async (req, res) => {
  try {
    const apiGatewayBaseUrl = process.env.API_GATEWAY_BASE_URL;
    
    if (!apiGatewayBaseUrl) {
      return res.status(500).json({ 
        error: "API Gateway base URL not configured",
        message: "Please check environment variables"
      });
    }

    let subtasksResponse;
    
    // Production - call the API Gateway endpoint
    const config = {
      method: "get",
      url: `${apiGatewayBaseUrl}/subtasks`,
      headers: {
        "Content-Type": "application/json",
      },
    };
    console.log("invoking subtasks API Gateway endpoint:", config.url);
    subtasksResponse = await axios(config);
    
    console.info(
      `${req.method} ${req.originalUrl} - Subtasks Request Successful!!`
    );
    
    res.json({
      ...subtasksResponse.data,
      mainService: 'api-gateway',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error(
      `${req.method} ${req.originalUrl} - Error calling subtasks:`, error.message
    );
    res.status(500).json({ 
      message: "Error calling subtasks function",
      error: error.message
    });
  }
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
