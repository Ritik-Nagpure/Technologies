# Docker Containers

## What is a Container?
- A **Docker container** is a lightweight, portable, and isolated runtime environment.
- It is created from a Docker image and runs the application with all its dependencies.
- Containers share the host OS kernel but remain isolated from each other.
- Think of a container as a **running instance of an image**.

---

## Key Characteristics
- **Isolation:** Each container runs independently, avoiding conflicts between applications.
- **Portability:** Containers run consistently across different environments (dev, test, prod).
- **Lightweight:** Containers start in seconds and consume fewer resources than virtual machines.
- **Ephemeral:** Containers can be stopped, removed, and recreated easily.
- **Writable Layer:** Each container adds a thin writable layer on top of the image.

---

## Lifecycle of a Container
1. **Create/Run**
   - `docker run -d <image>` → starts a new container.
2. **List**
   - `docker ps` → shows running containers.
   - `docker ps -a` → shows all containers (including stopped).
3. **Interact**
   - `docker exec -it <container_id> sh` → run commands inside a container.
   - `docker logs <container_id>` → view logs.
4. **Stop/Restart**
   - `docker stop <container_id>` → stop a container.
   - `docker restart <container_id>` → restart a container.
5. **Remove**
   - `docker rm <container_id>` → delete a container.

---

## Common Commands
- Run container: `docker run -d -p 8080:80 nginx`
- List containers: `docker ps`
- Inspect container: `docker inspect <container_id>`
- Copy files: `docker cp <container_id>:/path /host_path`
- Attach to container: `docker attach <container_id>`

---

## Practical Insights
- **Image vs Container:**  
  - Image = blueprint (static, read-only).  
  - Container = running instance (dynamic, writable).  

- **Networking:** Containers can be connected via Docker networks for communication.  
- **Volumes:** Containers use volumes for persistent data storage.  
- **Scaling:** Multiple containers can be run from the same image to scale applications.  

---

## Best Practices
- Keep containers **stateless**; use volumes for persistence.
- Use `--rm` for temporary containers to auto-clean after exit.
- Assign meaningful names with `--name` for easier management.
- Limit container privileges for security (`--user`, `--cap-drop`).
- Monitor with `docker stats` for resource usage.

---

## Quick Mnemonic
**C-L-I-S-R → Create, List, Interact, Stop, Remove**
