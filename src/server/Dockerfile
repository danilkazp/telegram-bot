# base image
FROM node:14

# set working directory
WORKDIR /usr/src/app/server
COPY package*.json ./

# concat multiple run instructions
# sort them alphabetically
#RUN npm install \
#    npm audit fix
ENV PATH /usr/src/app/server/node_modules/.bin:$PATH

RUN yarn install

COPY . ./

# ADD . .
EXPOSE 8000

CMD ["yarn", "dev"]