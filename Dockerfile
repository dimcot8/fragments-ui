# Build stage
# Use node version 20.1.0
FROM node:20.1.0 AS build

LABEL maintainer="Dmytro Benko <dbenko1@myseneca.ca>"
LABEL description="Fragments-ui node.js microservice"

# We default to use port 8080 in our service
ENV PORT=8080

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# Use /app as our working directory
WORKDIR /app

# Option 2: relative path - Copy the package.json and package-lock.json
# files into the working dir (/app).  NOTE: this requires that we have
# already set our WORKDIR in a previous step.
COPY package*.json ./

# Install node dependencies defined in package-lock.json
RUN npm install


# Copy src to /app/src/
COPY ./src ./src

# Deploy Stage
FROM node:20.1.0 AS deploy

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy our built js source code from build image
COPY --from=build /app ./

# Start the container by running our server
CMD ["npm", "start"]

# We run our service on port 8080
EXPOSE 1234
