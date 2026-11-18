
## 6. Docker

## 1. What is Docker?

Docker is an open-source platform used to build, package, distribute, and run applications inside isolated environments called containers.

A container includes the application code, runtime, dependencies, libraries, and configuration required to run the application.

It ensures that an application behaves consistently across different environments, such as development, testing, and production.

Key concepts:

1. Docker Image:
   A read-only template containing application code and dependencies.

2. Docker Container:
   A running instance of a Docker image.

3. Dockerfile:
   A configuration file containing instructions to build a Docker image.

4. Docker Engine:
   The platform responsible for building and running containers.

5. Docker Registry:
   A repository used to store and distribute Docker images, such as Docker Hub and Amazon ECR.

6. Docker Compose:
   A tool used to define and run multiple containers together.

I understand Docker as a way to package applications with their dependencies so that they can run consistently across different environments.

## 2. What is the purpose of Docker?

The primary purpose of Docker is to simplify application deployment by packaging applications and their dependencies into portable containers.

Major benefits:

1. Environment Consistency:
   Ensures applications run consistently across development, testing, and production.

2. Portability:
   Containers can run across different environments that support Docker.

3. Isolation:
   Applications run in isolated environments, reducing dependency conflicts.

4. Scalability:
   Containers can be replicated to handle increased application workloads.

5. Faster Deployment:
   Applications can be packaged and deployed without manually configuring dependencies on every server.

6. Resource Efficiency:
   Containers share the host operating system kernel and generally require fewer resources than traditional virtual machines.

7. Microservices:
   Each microservice can be packaged and deployed independently.

Example:

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

Build and run:

```bash
docker build -t my-node-app .

docker run -p 3000:3000 my-node-app
```

This packages a Node.js application into a Docker image and runs it inside a container.

