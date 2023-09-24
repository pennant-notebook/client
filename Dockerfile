# Use the official Playwright base image
FROM mcr.microsoft.com/playwright

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
