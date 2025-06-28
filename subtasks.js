// Helper function for complex subtasks
const performComplexSubtasks = async () => {
  const subtasks = [];
  
  // Subtask 1: Fibonacci calculation
  const fib = (n) => n <= 1 ? n : fib(n - 1) + fib(n - 2);
  const fibResult = fib(10);
  subtasks.push({ 
    name: 'fibonacci_calculation', 
    input: 10, 
    result: fibResult,
    complexity: 'O(2^n)'
  });
  
  // Subtask 2: Array sorting
  const unsortedArray = Array.from({ length: 100 }, () => Math.floor(Math.random() * 1000));
  const sortedArray = [...unsortedArray].sort((a, b) => a - b);
  subtasks.push({ 
    name: 'array_sorting', 
    inputSize: unsortedArray.length, 
    result: sortedArray.slice(0, 5), // Return first 5 for brevity
    complexity: 'O(n log n)'
  });
  
  // Subtask 3: String processing
  const longString = 'This is a long string that needs to be processed for various operations';
  const wordCount = longString.split(' ').length;
  const charCount = longString.length;
  const upperCase = longString.toUpperCase();
  subtasks.push({ 
    name: 'string_processing', 
    input: longString,
    results: {
      wordCount,
      charCount,
      upperCase: upperCase.substring(0, 20) + '...'
    }
  });
  
  // Subtask 4: Mathematical operations
  const randomNum = Math.floor(Math.random() * 1000);
  const mathOperations = {
    square: Math.pow(randomNum, 2),
    cube: Math.pow(randomNum, 3),
    sqrt: Math.sqrt(randomNum),
    log: Math.log(randomNum),
    sin: Math.sin(randomNum),
    cos: Math.cos(randomNum)
  };
  subtasks.push({ 
    name: 'mathematical_operations', 
    input: randomNum,
    results: mathOperations
  });
  
  // Subtask 5: Object manipulation
  const complexObject = {
    id: Math.random().toString(36).substring(7),
    data: Array.from({ length: 10 }, (_, i) => ({
      index: i,
      value: Math.random() * 100,
      timestamp: new Date(Date.now() + i * 1000).toISOString()
    })),
    metadata: {
      created: new Date().toISOString(),
      version: '1.0.0',
      tags: ['subtask', 'processing', 'lambda']
    }
  };
  
  const processedObject = {
    ...complexObject,
    data: complexObject.data.filter(item => item.value > 50),
    summary: {
      totalItems: complexObject.data.length,
      filteredItems: complexObject.data.filter(item => item.value > 50).length,
      averageValue: complexObject.data.reduce((sum, item) => sum + item.value, 0) / complexObject.data.length
    }
  };
  
  subtasks.push({ 
    name: 'object_manipulation', 
    input: complexObject,
    result: processedObject
  });
  
  return subtasks;
};

exports.handler = async (event) => {
  try {
    console.info('SubTasks Lambda function invoked');
    const startTime = Date.now();

    // Perform complex subtasks
    const complexSubtasks = await performComplexSubtasks();
    const totalProcessingTime = Date.now() - startTime;
    
    console.info('SubTasks processing completed successfully');
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
      body: JSON.stringify({
        message: 'SubTasks processing completed',
        complexSubtasks: complexSubtasks,
        service: 'subtasks-lambda',
        timestamp: new Date().toISOString(),
        totalProcessingTime: totalProcessingTime,
        totalTasks: complexSubtasks.length
      })
    };
    
  } catch (error) {
    console.error('Error in SubTasks Lambda:', error.message);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
      body: JSON.stringify({
        error: 'Failed to process subtasks',
        message: error.message,
        service: 'subtasks-lambda',
        timestamp: new Date().toISOString()
      })
    };
  }
}; 