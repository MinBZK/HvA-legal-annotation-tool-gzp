FROM node:18 as base

# ---- Development ----
FROM base as dev

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD npm run dev

# ---- Release ----
FROM base as prod

ARG NEXT_BASE_PATH=""
ENV NEXT_BASE_PATH=${NEXT_BASE_PATH}

ARG NEXT_PUBLIC_API_URL=
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

RUN npm run build

ENTRYPOINT npm run start