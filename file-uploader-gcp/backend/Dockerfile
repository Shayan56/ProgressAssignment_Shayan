# Use Node.js LTS
FROM node:18

# Set working directory
WORKDIR /app

# Copy files
COPY package*.json ./
RUN npm install
COPY . .

# Run the app
CMD ["node", "index.js"]
