FROM node:12-alpine3.14
WORKDIR /app
COPY package*.json .
RUN npm ci 
COPY . .
# CMD ["npm", "start"]
CMD ["npm", "run", "dev"]
EXPOSE 8081

