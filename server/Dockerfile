FROM node:18-alpine  # Change Node version if needed

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000  # Match this with your PORT variable in server.js

CMD ["node", "server.js"]