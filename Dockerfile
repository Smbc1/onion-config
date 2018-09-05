FROM node:8-alpine

COPY . /opt/workdir
WORKDIR /opt/workdir

RUN npm i --production --silent

CMD ["npm", "run", "test"]
