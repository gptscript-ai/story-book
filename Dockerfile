FROM node:20 as dev
WORKDIR /app
COPY . .
RUN npm install
RUN ./node_modules/.bin/gptscript --assemble story-book.gpt > story-book-assembled.gpt
EXPOSE 3000
CMD [ "npm", "run", "dev" ]

FROM node:20 as prod
WORKDIR /app
COPY --from=dev /app .
RUN npm run build
CMD [ "npm", "run", "start" ]
