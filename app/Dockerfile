FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json .
RUN npm ci && npm cache clean --force
COPY . .
CMD npm run db:migrate-init && npm run db:seed && npm start