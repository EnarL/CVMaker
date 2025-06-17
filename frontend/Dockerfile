# Build stage
FROM node:18 AS build

WORKDIR /server

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /server

COPY --from=build /server ./
RUN npm install --omit=dev

EXPOSE 3000
CMD ["npm", "start"]