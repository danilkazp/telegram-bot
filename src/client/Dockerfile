# base image
FROM node:14

# set working directory
WORKDIR /usr/src/app/client
COPY package*.json ./

# concat multiple run instructions
# sort them alphabetically
#RUN npm install \
#    npm audit fix
ENV PATH /usr/src/app/client/node_modules/.bin:$PATH

RUN yarn install

COPY . ./

# ADD . .
EXPOSE 3000

CMD ["yarn", "start"]