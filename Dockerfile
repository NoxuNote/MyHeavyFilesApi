FROM node:14

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 2267
CMD ["npm", "start"]