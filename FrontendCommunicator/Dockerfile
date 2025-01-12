FROM node:18-alpine

# Set working directory inside the container
WORKDIR /frontendApp

# Copy package.json and package-lock.json (if present) and install dependencies
COPY FrontendCommunicator/package*.json ./
RUN npm install

# Copy the rest of the frontend files
COPY FrontendCommunicator/ ./

# Build the application for production without warnings
ENV CI=true
RUN npm run build --silent || echo "Built with error codes"

# Expose the port the app will run on
EXPOSE 5137

# Command to run the Vite development server or serve the production build (if running locally)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
