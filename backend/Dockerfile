# Use official Node image
FROM node:18

# Set working directory
WORKDIR /app

# Copy files and install deps
COPY package*.json ./
RUN npm install

# Copy rest of backend
COPY . .

# Expose backend port (adjust if different)
EXPOSE 5000

# Start server
CMD ["node", "index.js"]
