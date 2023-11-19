# Use the official Node image
FROM node:14 AS build
WORKDIR /app

# Copy package.json and install dependencies
COPY Frontend/package*.json ./
RUN npm install

# Copy the remaining source code and build the application
COPY Frontend/. ./
RUN npm run build

# Use a lightweight Node image for the runtime
FROM node:14-alpine
WORKDIR /app
COPY --from=build /app/build .

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
