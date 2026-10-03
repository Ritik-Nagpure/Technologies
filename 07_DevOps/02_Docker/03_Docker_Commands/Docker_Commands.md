# Docker Commands – Categorized Notes

## 1. Image Management
- List images: `docker images`
- Build image: `docker build -t <name>:<tag> .`
- Pull image: `docker pull <image>`
- Push image: `docker push <image>`
- Remove image: `docker rmi <image_id>`
- Inspect image: `docker inspect <image_id>`
- Show image history: `docker history <image_id>`
- Tag image: `docker tag <source_image> <target_image>`

---

## 2. Container Lifecycle
- Run container: `docker run -d <image>`
- List running containers: `docker ps` or new `docker container ls`
- List all containers: `docker ps -a` or new `docker container ls -a`
- Stop container: `docker stop <container_id>`
- Start container: `docker start <container_id>`
- Restart container: `docker restart <container_id>`
- Remove container: `docker rm <container_id>`
- Pause container: `docker pause <container_id>`
- Unpause container: `docker unpause <container_id>`

---

## 3. Container Interaction
- Attach to container: `docker attach <container_id>`
- Execute command inside container: `docker exec -it <container_id> <command>`
- View logs: `docker logs <container_id>`
- Inspect container: `docker inspect <container_id>`
- Copy files: `docker cp <container_id>:<path> <host_path>`

---

## 4. Networking
- List networks: `docker network ls`
- Create network: `docker network create <network_name>`
- Connect container to network: `docker network connect <network_name> <container_id>`
- Disconnect container: `docker network disconnect <network_name> <container_id>`
- Inspect network: `docker network inspect <network_name>`

---

## 5. Volumes & Storage
- List volumes: `docker volume ls`
- Create volume: `docker volume create <volume_name>`
- Inspect volume: `docker volume inspect <volume_name>`
- Remove volume: `docker volume rm <volume_name>`
- Mount volume in container: `docker run -v <volume_name>:<path> <image>`

---

## 6. System & Cleanup
- Show system info: `docker info`
- Show Docker version: `docker version`
- Remove unused containers/images/networks: `docker system prune`
- Remove unused volumes: `docker volume prune`
- Check disk usage: `docker system df`

---

## 7. Registry & Authentication
- Login to registry: `docker login`
- Logout from registry: `docker logout`
- Search images: `docker search <image_name>`

---

## Quick Mnemonic
**I-C-N-V-S-R → Images, Containers, Networking, Volumes, System, Registry**
