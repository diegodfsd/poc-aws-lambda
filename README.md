<!--
title: AWS Serverless example in NodeJS
description: This example demonstrates how can you use AWS Lambdas to build your microservices.
layout: Doc
-->
# Serverless

This example demonstrates how can you use AWS Lambdas to build your microservices.

## Use-cases

- Trying to query spotify api

## Quick Start

1. **Install via npm:**
  ```bash
  npm install -g serverless
  ```

2. **Initialize a serverless service:**

  You can create a new service.
  ```bash
  # Create a new Serverless Service/Project
  serverless create --template aws-nodejs --path service-name
  # Change into the newly created directory
  cd service-name
  ```

3. **Deploy a Service:**

  Use this when you have made changes to your Functions, Events or Resources in `serverless.yml` or you simply want to deploy all changes within your Service at the same time.
  ```bash
  serverless deploy -v
  ```
