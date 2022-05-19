# Project Assessment Platform

This is a chat app within two people

## Key Technologies

**Server-Side:** Node JS, Express JS , JavaScript

**Database:** MongoDB (with ODM mongoose)

**Real Time Data Trasfer:** Socket.io

## Key Features

- User can login.
- User can SignUp.
- User can search all other's user by name.
- User Can chat with all valid user.
- When user `A` send a new message to user `B` then user `B` will get a `New message` notification.
- If User `A` and `B` is staying in the chat box and User `A` is writing something then User `B` can see a typing animation in his or her chat box.
- All data will be pass in the real time with socket the help of socket server.

## Run Locally

Clone the project

```bash
  git clone https://github.com/SYShopnil/ChatApp-Server.git

  cd ChatApp-Server
```

Install dependencies

```bash
  npm install || npm i
```

## Installation

```bash
  npm run dev
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

**`MONGO_URL `** //it wil be the mongodb database local or cloud server link.

**`JWT_CODE `** // it will be the JSON WEB TOKEN'S security code

**`DATA_URL `** //it will be the server side url

**`TOKEN_EXPIRE `** //It will be a token expire date in days. It will be a number(5 input that's mean 5 days)

**`SERVER_URL `** // it will be the port number where the backend server will run . Ex: 3030 (it will be a number)

**`CORS_ORIGIN `** //it will be the client site base url. ex: "http://localhost:3000"

## Support

For support, sadmanishopnil@gmail.com .
