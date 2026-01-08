# Use an official Node runtime as a parent image
FROM node:18-alpine

# Set work directory
WORKDIR /app

# Install dependencies first to leverage cache
COPY package.json package-lock.json ./
RUN npm install

# Copy project
COPY . .

# Expose port
EXPOSE 5173

# Run the app
CMD ["npm", "run", "dev", "--", "--host"]
