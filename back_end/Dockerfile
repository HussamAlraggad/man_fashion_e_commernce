FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++ postgresql-client

COPY package*.json ./

RUN npm ci --ignore-scripts

COPY . .

RUN npm run build

EXPOSE 9000

CMD ["npm", "run", "dev"]