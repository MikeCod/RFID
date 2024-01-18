# we are using multi stage build process to keep the image size as small as possible
FROM node:18-alpine

RUN apk add --no-cache libc6-compat
RUN apk update && apk upgrade && apk add dumb-init && adduser -D nextuser 

# set work dir as app
WORKDIR /app

# expose 3000 on container
EXPOSE 3000

# set app host ,port and node env 
ENV HOST=0.0.0.0 PORT=3000 NODE_ENV=development

CMD ["npm", "run", "dev"]