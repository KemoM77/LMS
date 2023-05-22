# Use an official Node.js runtime as the base image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install -g npm@latest

RUN npm install

# Copy the entire app to the container
COPY . .

# Build the Next.js app
RUN npm run build

# Start the Next.js app
CMD npm run start
