FROM node:18-alpine  

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# Add environment variable for production build
ENV NODE_ENV=production
ENV REACT_APP_API_URL=/api  

# Build the application
RUN npm run build

# Install serve to run the application
RUN npm install -g serve

EXPOSE 3000

# Use serve to run the built React app
CMD ["serve", "-s", "build", "-l", "3000"] 
