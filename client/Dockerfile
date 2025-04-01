FROM node:18-alpine  # Change Node version if needed

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# Add environment variable for production build
ENV NODE_ENV=production
ENV REACT_APP_API_URL=/api  # Change if your API path is different

# Build the application
RUN npm run build

# Install serve to run the application
RUN npm install -g serve

EXPOSE 3000  # Change if you want to use a different port

# Use serve to run the built React app
CMD ["serve", "-s", "build", "-l", "3000"]  # Match port with EXPOSE