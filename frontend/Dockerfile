# Use official Node image
FROM node:18

# Set working directory
WORKDIR /app

# Copy files and install deps
COPY package*.json ./
RUN npm install

# Copy rest of the frontend
COPY . .

# Build the frontend
RUN npm run build

# Use Vite preview for production-like preview (adjust port as needed)
EXPOSE 4173
CMD ["npm", "run", "dev", "--", "--host"]
