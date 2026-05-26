# Use Node.js official image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Expose Vite default port
EXPOSE 5173

# Start Vite development server
CMD ["npm", "run", "dev", "--", "--host"]