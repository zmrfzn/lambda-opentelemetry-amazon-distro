## Table of contents 
- [Overview](#overview)
- [Serverless Framework Node Express API on AWS](#serverless-framework-node-express-api-on-aws)
  - [Anatomy of the template](#anatomy-of-the-template)
  - [Architecture](#architecture)
  - [Usage](#usage)
    - [Deployment](#deployment)
    - [Invocation](#invocation)
    - [Local development](#local-development)

# Overview 
Deploy a function with OpenTelemetry on Lambda via Amazon's Distro for OpenTelemetry(ADOT)

# Serverless Framework Node Express API on AWS

This template demonstrates how to develop and deploy a simple Node Express API service running on AWS Lambda using the traditional Serverless Framework with multiple Lambda functions for microservices architecture.

## Anatomy of the template

This template configures three functions:

1. **`api`** - Main API Gateway handler responsible for routing all incoming requests using Express.js
2. **`catfacts`** - Dedicated Lambda function for fetching cat facts from external API
3. **`subtasks`** - Dedicated Lambda function for complex computational tasks

The main `api` function uses `httpApi` event to accept all incoming requests, and `express` framework handles routing internally. Implementation takes advantage of `serverless-http` package, which allows you to wrap existing `express` applications.

## Architecture

```
API Gateway → Main API Lambda (Express Router)
    ├── / → Root endpoint with micro tasks
    ├── /path → Path endpoint with micro tasks  
    ├── /weather → Calls CatFacts Lambda (replaces weather API)
    └── /subtasks → Calls SubTasks Lambda
```

Each Lambda function includes:
- OpenTelemetry instrumentation via ADOT
- Micro tasks for observability
- Error handling and logging
- CORS headers for web compatibility

## Usage

### Deployment

Install dependencies with:

```
npm install
```

and then deploy with:

```
serverless deploy
```

After running deploy, you should see output similar to:

```bash
Deploying otel-sls-adot-latest to stage dev (us-east-1)

✔ Service deployed to stack otel-sls-adot-latest-dev (196s)

endpoint: ANY - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com
functions:
  api: otel-sls-adot-latest-dev-api (766 kB)
  catfacts: otel-sls-adot-latest-dev-catfacts (256 kB)
  subtasks: otel-sls-adot-latest-dev-subtasks (512 kB)
```

_Note_: In current form, after deployment, your API is public and can be invoked by anyone. For production deployments, you might want to configure an authorizer. For details on how to do that, refer to [`httpApi` event docs](https://www.serverless.com/framework/docs/providers/aws/events/http-api/).

### Invocation

After successful deployment, you can call the created application via HTTP:

```bash
# Root endpoint with micro tasks
curl https://xxxxxxx.execute-api.us-east-1.amazonaws.com/

# Path endpoint with micro tasks
curl https://xxxxxxx.execute-api.us-east-1.amazonaws.com/path

# Weather endpoint (now returns cat facts)
curl https://xxxxxxx.execute-api.us-east-1.amazonaws.com/weather?location=NYC

# Subtasks endpoint
curl https://xxxxxxx.execute-api.us-east-1.amazonaws.com/subtasks

# POST endpoint with micro tasks
curl -X POST https://xxxxxxx.execute-api.us-east-1.amazonaws.com/ \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello from client"}'
```

### Local development

It is also possible to emulate API Gateway and Lambda locally by using `serverless-offline` plugin. In order to do that, execute the following command:

```bash
serverless plugin install -n serverless-offline
```

It will add the `serverless-offline` plugin to `devDependencies` in `package.json` file as well as will add it to `plugins` in `serverless.yml`.

After installation, you can start local emulation with:

```
serverless offline
```

To learn more about the capabilities of `serverless-offline`, please refer to its [GitHub repository](https://github.com/dherault/serverless-offline).
