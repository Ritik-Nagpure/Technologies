# Docker Interview Notes

## What is Docker?
- **Docker** is a containerization platform that allows developers to package applications with all dependencies into isolated units called **containers**.
- Containers ensure consistency across environments (development, testing, production).
- Unlike virtual machines, containers share the host OS kernel, making them lightweight and fast.

**Key Interview Point:** Be ready to explain how Docker solves the “works on my machine” problem by standardizing environments.

---

## Why Docker?
- **Portability:** Applications run the same way across different environments.
- **Efficiency:** Containers use fewer resources compared to VMs.
- **Scalability:** Easy to scale microservices using orchestration tools like Kubernetes.
- **Isolation:** Each container runs independently, reducing conflicts.

**Interview Nugget:** Highlight Docker’s role in CI/CD pipelines and DevOps workflows.

---

## Docker Architecture
Docker follows a **client-server architecture**:

- **Docker Client (`docker`)**
  - CLI tool that sends commands like `docker run`, `docker build`, `docker ps`.
  - Communicates with the Docker daemon via REST API.

- **Docker Daemon (`dockerd`)**
  - Runs on the host machine.
  - Responsible for building, running, and managing containers.
  - Listens for requests from the client.

- **Docker Objects**
  - **Images:** Read-only templates used to create containers. Built using a `Dockerfile`.
  - **Containers:** Running instances of images. Example: `docker run nginx`.
  - **Volumes:** Persistent storage mechanism.
  - **Networks:** Enable communication between containers.

- **Docker Registry**
  - Stores Docker images.
  - Default registry: **Docker Hub**.
  - Example: `docker pull ubuntu`.

**Interview Nugget:** Be prepared to sketch or explain this architecture verbally. Emphasize how the client, daemon, and registry interact.

---

## Common Docker Commands (Inline Examples)
- Create and run a container: `docker run -d nginx`
- List running containers: `docker ps`
- Build an image: `docker build -t myapp .`
- Remove a container: `docker rm <container_id>`
- Pull an image: `docker pull ubuntu`
- Inspect container details: `docker inspect <container_id>`

---

## Interview-Centric Highlights
- **Difference between VM and Docker:** VMs virtualize hardware; Docker virtualizes OS kernel.
- **Dockerfile:** Blueprint for building images. Key instructions: `FROM`, `RUN`, `COPY`, `CMD`.
- **Best Practices:**
  - Use small base images (`alpine`).
  - Minimize layers in `Dockerfile`.
  - Leverage `.dockerignore` to exclude unnecessary files.
- **CI/CD Integration:** Docker images ensure consistent builds across Jenkins, GitHub Actions, etc.
- **Troubleshooting Tip:** Use `docker logs <container_id>` and `docker exec -it <container_id> sh` for debugging.

---

## Quick Comparison: VM vs Docker

| Feature          | Virtual Machine         | Docker Container         |
|------------------|-------------------------|--------------------------|
| Startup Time     | Minutes                 | Seconds                  |
| Resource Usage   | Heavy (full OS)         | Lightweight (shared OS)  |
| Isolation        | Strong (hardware level) | Process-level isolation  |
| Portability      | Limited                 | High                     |

---
## How Docker Works – Interview Notes

### Step-by-Step Workflow

1. **Write a Dockerfile**
   - Define instructions (`FROM`, `COPY`, `RUN`, `CMD`) to build an image.
   - Example: `FROM node:18-alpine` sets the base environment.

2. **Build an Image**
   - Use `docker build -t myapp .` to create an image from the Dockerfile.
   - The image is a snapshot containing app code + dependencies.

3. **Store or Share the Image**
   - Images can be pushed to a registry like Docker Hub using `docker push myapp`.
   - This makes them portable across machines and teams.

4. **Run a Container**
   - Start a container from the image: `docker run -d myapp`.
   - The container is an isolated runtime environment for the application.

5. **Container Execution**
   - The container runs the application exactly as defined in the image.
   - Multiple containers can run simultaneously without interfering.

6. **Networking & Communication**
   - Containers can be connected via Docker networks.
   - Example: `docker network create mynet` then `docker run --network=mynet`.

7. **Data Persistence**
   - Use volumes for persistent storage: `docker volume create mydata`.
   - Attach with `docker run -v mydata:/app/data myapp`.

8. **Monitoring & Debugging**
   - Check logs: `docker logs <container_id>`.
   - Inspect details: `docker inspect <container_id>`.
   - Enter container: `docker exec -it <container_id> sh`.

9. **Stop & Remove Containers**
   - Stop: `docker stop <container_id>`.
   - Remove: `docker rm <container_id>`.

10. **Cleanup**
    - Remove unused images: `docker rmi <image_id>`.
    - Prune system: `docker system prune`.

---

## Interview Nuggets
- **Key Idea:** Docker works by packaging applications into images, then running them as containers.
- **Efficiency:** Containers start in seconds and use fewer resources than VMs.
- **Portability:** Same image runs consistently across dev, test, and prod.
- **Isolation:** Each container runs independently, avoiding dependency conflicts.
- **CI/CD Role:** Docker ensures reproducible builds and deployments in pipelines.

---

## Quick Mnemonic
- **F**ile → **B**uild → **R**egistry → **R**un → **N**etwork → **D**ata → **M**onitor → **S**top → **C**leanup


## Final Interview Tip
When asked about Docker, **always connect your answer to real-world DevOps scenarios**: CI/CD pipelines, microservices, and environment consistency. Interviewers value practical insights over textbook definitions.
