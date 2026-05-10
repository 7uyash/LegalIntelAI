FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy app
COPY . .

# Build
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
