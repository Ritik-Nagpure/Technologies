# Docker Images Notes

## Core Idea
- A **Docker image** is a read-only template used to create containers.
- It bundles application code, runtime, libraries, and configuration into a single package.
- Acts as a blueprint: containers are instances of images.

---

## Key Properties
- **Immutable:** Once built, cannot be changed. Any update requires a new image build.
- **Layered:** Each instruction in a `Dockerfile` adds a new layer. Layers are cached and reused.
- **Portable:** Can be shared across systems via registries.
- **Versioned:** Tagged for identification (`myapp:v1`, `myapp:latest`).

---

## Workflow
1. **Define a Dockerfile**
   - Example: `FROM ubuntu:20.04`
   - Instructions like `RUN`, `COPY`, `CMD` create layers.

2. **Build the Image**
   - Command: `docker build -t myapp .`
   - Produces a layered image stored locally.

3. **Store or Share**
   - Push to registry: `docker push myapp`
   - Pull from registry: `docker pull ubuntu`

4. **Run a Container**
   - Command: `docker run -d myapp`
   - Container adds a writable layer on top of the image.

---

## Common Commands
- List images: `docker images`
- Remove image: `docker rmi <image_id>`
- Inspect image: `docker inspect <image_id>`
- Tag image: `docker tag myapp:v1 repo/myapp:v1`

---

## Practical Insights
- **Image vs Container:**  
  - Image = static blueprint.  
  - Container = dynamic, running instance.  

- **Layering Benefits:**  
  - Faster builds and smaller storage footprint.  
  - Shared layers reduce duplication.  

- **Best Practices:**  
  - Use minimal base images (`alpine`).  
  - Combine commands to reduce layers.  
  - Use `.dockerignore` to exclude unnecessary files.  

- **Real-World Use:**  
  - Ensures consistent builds across environments.  
  - Integral to CI/CD pipelines and orchestration platforms.


# How Docker Build Works

## Step-by-Step Process

1. **Read the Dockerfile**
   - Docker starts by parsing the `Dockerfile` line by line.
   - Each instruction (`FROM`, `RUN`, `COPY`, `CMD`) defines how the image should be built.

2. **Choose the Base Image**
   - The `FROM` instruction specifies the starting point (e.g., `FROM ubuntu:20.04`).
   - If no base image is provided, Docker uses `scratch` (an empty image).

3. **Create Layers**
   - Each instruction in the `Dockerfile` creates a new **layer**.
   - Example: `RUN apt-get install curl` adds a layer with curl installed.
   - Layers are immutable and cached for reuse.

4. **Leverage Build Cache**
   - Docker checks if a layer already exists from previous builds.
   - If unchanged, Docker reuses the cached layer → faster builds.
   - If changed, Docker rebuilds that layer and all subsequent ones.

5. **Copy Files**
   - Instructions like `COPY` or `ADD` bring files from the host into the image.
   - These also create new layers.

6. **Execute Build Instructions**
   - Commands (`RUN`, `ENV`, `WORKDIR`) are executed inside intermediate containers.
   - The results are committed as new layers in the image.

7. **Set Metadata**
   - Instructions like `CMD`, `ENTRYPOINT`, `EXPOSE` define how the container should run.
   - These don’t add files but configure the image.

8. **Assemble Final Image**
   - Docker merges all layers into a single image.
   - The image is stored locally and can be listed with `docker images`.

9. **Tagging**
   - The image is tagged for identification: `docker build -t myapp:v1 .`
   - Tags make it easy to push/pull from registries.

10. **Push to Registry (Optional)**
    - The built image can be uploaded to Docker Hub or a private registry using `docker push`.

---

## Key Insights
- **Layered Architecture:** Each instruction = one layer → efficient storage and caching.
- **Build Cache:** Speeds up rebuilds by reusing unchanged layers.
- **Final Image:** A stack of layers + metadata, ready to run as a container.

---

## Quick Mnemonic
**B-L-C-E-M-T → Build, Layers, Cache, Execute, Metadata, Tag**

---

- ## how image is built ?

    When Docker builds an image, it reads the Dockerfile line by line.
    Each instruction creates a new immutable layer stacked on top of the previous one.
    Docker reuses cached layers if nothing has changed, speeding up the build.
    Finally, all layers are combined into a single packaged image, tagged for use.
    That image then serves as the blueprint to run containers consistently across environments.
---

# Docker Layers

- **Definition:** A layer is an immutable snapshot of changes made by a single instruction in a `Dockerfile`.
- **Composition:** Each layer contains filesystem modifications — for example, installing a package, copying files, or setting environment variables.
- **Stacking:** Layers are stacked on top of each other to form the complete image. The topmost writable layer becomes the container’s runtime environment.
- **Efficiency:** Layers are cached and shared across images, reducing duplication and improving build speed.

---

## How a Layer is Built
1. **Dockerfile Instruction**
   - Each command (`FROM`, `RUN`, `COPY`, `ADD`, etc.) triggers the creation of a new layer.
   - Example: `RUN apt-get install curl` → adds a layer with curl installed.

2. **Intermediate Container Execution**
   - Docker spins up a temporary container to execute the instruction.
   - The results (filesystem changes) are committed as a new layer.

3. **Caching Mechanism**
   - If the instruction hasn’t changed since the last build, Docker reuses the cached layer.
   - If it has changed, Docker rebuilds that layer and all subsequent ones.

4. **Layer Storage**
   - Layers are stored locally and can be inspected with `docker history <image>`.
   - They are immutable, meaning once created, they cannot be altered.

---

## Example
```dockerfile
FROM ubuntu:20.04        # Base layer
RUN apt-get update       # New layer with updated package index
RUN apt-get install -y python3  # Layer with Python installed
COPY app.py /app         # Layer with application code
CMD ["python3", "/app/app.py"]  # Metadata layer 
```

for execution: 
- Each line above creates a new layer.
- The final image is a stack of these layers.
- When you run the container, Docker adds a thin writable layer on top for runtime changes.