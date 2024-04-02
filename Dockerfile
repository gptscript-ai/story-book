FROM node:20 as dev
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
CMD [ "npm", "run", "dev" ]

FROM node:20 as prod
WORKDIR /app
COPY --from=dev /app .
RUN npm run build
CMD [ "npm", "run", "start" ]
