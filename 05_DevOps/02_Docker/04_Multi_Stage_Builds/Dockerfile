FROM node:24 AS builder
WORKDIR /app
RUN apt-get update && apt-get install -y git
RUN git clone https://github.com/Ritik-Nagpure/Sarvum.git .
RUN npm install
RUN npx prisma generate
RUN npm run build

FROM node:24-slim
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
RUN npm install --omit=dev
CMD ["node", "dist/index.js"]
