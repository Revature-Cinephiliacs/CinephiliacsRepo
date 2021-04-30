FROM node:12.18-alpine
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm cache clean --force
RUN npm install
COPY . .
RUN npm run build -- --prod
WORKDIR /usr/src/app/dist/CinephiliacsRepo
EXPOSE 80
ENV PORT 80
RUN npm install http-server -g
CMD ["http-server"]
