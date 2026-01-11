# 🐳 Dockerfile to run Node.js app from GitHub

# 1. Use an official Node base image
FROM node:18

# 2. Set working directory inside container
WORKDIR /usr/src/app

# 3. Install git (needed to clone repo)
RUN apt-get update && apt-get install -y git \
    && rm -rf /var/lib/apt/lists/*

# 4. Clone the GitHub repository
# Replace <repo-url> with your actual GitHub repo link
RUN git clone https://github.com/Ritik-Nagpure/Sarvum.git .

# 5. Install dependencies
RUN npm install

# 6. Build the project (TypeScript → dist)
RUN npm run build

# 7. Expose app port
EXPOSE 3000

# 8. Start the app from dist
CMD ["npm", "run", "serve"]
