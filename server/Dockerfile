FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3040
CMD ["npm", "run", "start:prod"]