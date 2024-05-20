FROM node 

COPY package.json package.json
COPY package-lock.json package-lock.json
COPY  src src
COPY .env .env
COPY  app.js app.js
COPY index.js index.js 


RUN  npm install
ENTRYPOINT [ "node" ,"app.js" ]