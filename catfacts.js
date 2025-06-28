const axios = require("axios");

exports.handler = async (event) => {
  try {
    console.info('CatFacts Lambda function invoked');
    
    // Call the catfact.ninja API
    const config = {
      method: "get",
      url: "https://catfact.ninja/fact",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await axios(config);
    
    console.info('CatFacts API call successful');
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
      body: JSON.stringify({
        ...response.data,
        service: 'catfacts-lambda',
        timestamp: new Date().toISOString()
      })
    };
    
  } catch (error) {
    console.error('Error in CatFacts Lambda:', error.message);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
      body: JSON.stringify({
        error: 'Failed to fetch cat fact',
        message: error.message,
        service: 'catfacts-lambda',
        timestamp: new Date().toISOString()
      })
    };
  }
}; 