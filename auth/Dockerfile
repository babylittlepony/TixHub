FROM node:alpine

WORKDIR /app
COPY package.json .
# RUN npm cache clean --force
RUN npm install --omit=dev
COPY . .

CMD ["npm", "start"]