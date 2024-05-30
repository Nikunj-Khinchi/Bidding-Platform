# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install the application's dependencies inside the container
RUN npm install

# Copy the rest of the application's code into the container
COPY . .

# Make port 3000 available to the outside of the container
EXPOSE 3000

# Define the command to run the application
CMD [ "node", "index.js" ]