
# A. AWS fundamentals and deployment

## 1. How have you used AWS in your projects?

I have used AWS services for application hosting, frontend deployment, backend deployment, file storage, serverless processing, and application monitoring.

In my previous project at Capgemini, I worked with AWS to deploy an enterprise Risk Intelligence and Compliance Analytics platform.

My responsibilities included:

1. Frontend Deployment: Hosted frontend build artifacts on Amazon S3 and distributed them through CloudFront.
2. Backend Deployment: Deployed Node.js backend services using AWS App Runner.
3. Serverless Processing: Used AWS Lambda for scheduled data processing, report generation, backups, and data retention.
4. Storage: Used Amazon S3 for storing application files and generated reports.
5. CI/CD: Integrated GitHub Actions to automate application build and deployment.
6. Monitoring: Worked with AWS CloudWatch for monitoring application operations.

In my current project at Principal Global Services, I also work with AWS services such as Lambda, ECS, DynamoDB, CloudFront, IAM, VPC, WAF, CloudWatch, and AWS CDK.

## 2. Do you actively use AWS?

Yes, I actively work with AWS as part of my application development and deployment activities.

I primarily use AWS for understanding application infrastructure, deployment workflows, serverless processing, cloud resource integration, and production support.

My experience includes S3, CloudFront, Lambda, App Runner, ECS, DynamoDB, IAM, VPC, WAF, CloudWatch, and AWS CDK.

## 3. Do you deploy the projects yourself, or does another team handle deployment?

I have been involved in both application deployment and collaboration with infrastructure and DevOps teams.

In my previous project at Capgemini, I worked on GitHub Actions CI/CD pipelines that automated frontend and backend builds and deployments.

The frontend was deployed to S3 and CloudFront, while backend services were deployed using AWS App Runner.

In my current project, I also participate in release activities, CI/CD workflows, and deployment-related discussions using GitHub Actions and AWS infrastructure.

My responsibility is primarily on the application development and integration side, while infrastructure-level access and production changes may involve coordination with the respective teams.

## 4. Which AWS services have you used in your projects?

I have worked with the following AWS services:

1. Amazon S3:
   Used for storing frontend build artifacts, application files, and generated reports.

2. Amazon CloudFront:
   Used as a CDN to distribute frontend assets with low latency.

3. AWS Lambda:
   Used for serverless data processing, report generation, scheduled tasks, and automation.

4. AWS App Runner:
   Used to deploy and run backend applications.

5. Amazon ECS:
   Used for containerized application deployment and management.

6. Amazon DynamoDB:
   Used as a managed NoSQL database.

7. AWS IAM:
   Used for managing users, roles, permissions, and access policies.

8. Amazon VPC:
   Used for network isolation and controlling communication between cloud resources.

9. AWS WAF:
   Used for protecting applications against common web exploits and unwanted traffic.

10. Amazon CloudWatch:
    Used for application monitoring, logs, metrics, and alarms.

11. AWS CDK:
    Used to define and provision AWS infrastructure through code.

## 5. What is Serverless Computing?

Serverless Computing is a cloud computing model where the cloud provider manages the underlying infrastructure, including server provisioning, scaling, and infrastructure maintenance.

Developers focus on writing and deploying application code instead of managing servers.

For example, AWS Lambda allows us to execute code in response to events without provisioning or managing servers.

Key characteristics:

1. No server management by application developers.
2. Automatic scaling based on workload.
3. Pay-per-use pricing model.
4. Event-driven execution.
5. Infrastructure management handled by the cloud provider.

However, serverless does not mean there are no servers. It means the cloud provider manages the servers.

# B. Amazon S3

## 6. What is Amazon S3?

Amazon Simple Storage Service (S3) is an AWS object storage service used to store and retrieve data from anywhere over the internet or through AWS services.

It stores data as objects inside containers called buckets.

Each object consists of:

1. Object Data: The actual file or content.
2. Object Key: The unique identifier used to access the object within a bucket.
3. Metadata: Additional information about the object.

Key features:

1. High durability.
2. Scalability.
3. Versioning.
4. Lifecycle management.
5. Access control using IAM and bucket policies.
6. Encryption.
7. Storage classes for different access patterns.

I have used S3 for storing frontend build artifacts, application files, and generated reports.

## 7. What types of files can we store in S3?

Amazon S3 is an object storage service, so it can store almost any type of file or binary data.

Some common examples are:

1. Documents: PDF, DOCX, TXT.
2. Images: PNG, JPEG, SVG.
3. Videos: MP4, AVI.
4. Audio: MP3, WAV.
5. Application Files: HTML, CSS, JavaScript.
6. Archives: ZIP, TAR, GZIP.
7. Data Files: CSV, JSON, XML, Parquet.
8. Backups: Database backups and application backups.

S3 does not require a predefined file structure or schema.

An individual S3 object can be up to 50 TB in size, with multipart upload supporting objects larger than 5 GB.

## 8. What are the different ways to upload files or objects into S3?

There are multiple ways to upload files into Amazon S3 depending on the application requirements.

1. AWS Management Console:
   Upload files manually through the AWS web interface.

2. AWS CLI:
   Upload files using terminal commands.

```bash
aws s3 cp file.txt s3://my-bucket/
```

3. AWS SDK:
   Upload files programmatically using SDKs such as AWS SDK for JavaScript.

4. Multipart Upload:
   Divide large files into smaller parts and upload them independently. This is useful for large files and unreliable network connections.

5. Pre-signed URLs:
   Generate temporary URLs that allow clients to upload files directly to S3 without exposing AWS credentials.

6. AWS Transfer Family:
   Transfer files using protocols such as SFTP, FTPS, and FTP.

For production applications, I prefer pre-signed URLs for direct client-to-S3 uploads because they reduce backend bandwidth consumption and avoid sending large files through the application server.

# C. AWS Lambda

## 9. What is AWS Lambda?

AWS Lambda is a serverless compute service provided by AWS that allows us to execute code without provisioning or managing servers.

We upload our code as a Lambda function, configure its runtime and permissions, and AWS executes it when triggered by an event.

Common triggers include:

1. API Gateway requests.
2. S3 object upload events.
3. EventBridge scheduled events.
4. SQS messages.
5. DynamoDB Streams.

Key features:

1. Automatic scaling.
2. Event-driven execution.
3. Pay-per-use pricing.
4. Integration with other AWS services.
5. Multiple supported programming runtimes.
6. Built-in execution monitoring through CloudWatch.

AWS Lambda is useful for background processing, scheduled jobs, file processing, API integrations, and event-driven architectures.

## 10. How have you used AWS Lambda in your projects?

In my previous project at Capgemini, I used AWS Lambda for automating background operations and scheduled processing tasks in the Risk Intelligence and Compliance Analytics platform.

My use cases included:

1. Scheduled Data Processing:
   Process compliance data periodically from integrated enterprise systems.

2. Report Generation:
   Generate reports based on processed compliance information.

3. Backup Creation:
   Automate backup-related operations.

4. Data Retention:
   Execute scheduled cleanup and retention-related tasks.

5. Auto-Reprocessing:
   Reprocess compliance data when required.

Lambda helped us execute these background operations without maintaining separate server infrastructure for every scheduled task.

# D. AWS Step Functions

## 11. What are AWS Step Functions?

AWS Step Functions is a serverless workflow orchestration service used to coordinate multiple AWS services and application components into a defined workflow.

It allows us to create workflows using state machines, where each state represents a particular operation or decision.

For example, consider an order processing workflow:

1. Receive Order:
   Accept the order request.

2. Validate Order:
   Verify the order details.

3. Process Payment:
   Execute the payment operation.

4. Update Inventory:
   Update available stock.

5. Send Notification:
   Notify the customer about the order status.

If any operation fails, we can configure retry mechanisms, error handling, and alternative execution paths.

Key features:

1. Workflow orchestration.
2. Retry and error handling.
3. Conditional branching.
4. Parallel execution.
5. Integration with AWS Lambda and other AWS services.
6. Execution monitoring and tracking.

It helps coordinate complex workflows without implementing all orchestration logic manually inside a single Lambda function.

## 12. Have you used Step Functions in your projects?

I have not directly implemented AWS Step Functions in my projects so far.

However, I understand their purpose and how they fit into event-driven and serverless architectures.

For example, if we need to generate a compliance report, validate the generated data, store the report in S3, and notify users, Step Functions can orchestrate these operations.

I would consider using Step Functions when a workflow involves multiple dependent operations, retries, conditional execution, and failure handling.

# E. API Gateway

## 13. How do you perform schema validation when using API Gateway?

In AWS API Gateway, we can perform request validation using request models and validators.

For REST APIs, API Gateway supports request validation for parameters and request bodies using JSON Schema models.

There are two common validation approaches:

1. Request Parameter Validation:
   Validate required query string parameters and headers.

2. Request Body Validation:
   Define a JSON Schema model to validate the incoming request body.

For example, consider a user registration API.

```json
{
    "type": "object",
    "required": ["name", "email"],
    "properties": {
        "name": {
            "type": "string"
        },
        "email": {
            "type": "string"
        },
        "age": {
            "type": "integer",
            "minimum": 18
        }
    }
}
```

We can associate this model with the POST API method and enable request body validation.

If the incoming request does not match the schema, API Gateway rejects the request before forwarding it to the backend integration.

For additional business validation, I would also implement validation inside the Node.js backend using libraries such as Zod or Joi.

This provides defense in depth because API Gateway handles basic request validation, while the backend remains responsible for business rules, authorization, and data integrity.
