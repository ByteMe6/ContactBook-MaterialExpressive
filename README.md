# ContactBook

A contact book web app with JWT authentication, built with React and Material Expressive design.

[Русский](./README.ru.md)

## Features

- Register and log in with JWT
- View, add, and delete contacts
- Protected routes — contacts page requires authentication
- Auth state persisted in localStorage
- Redux Toolkit for state management

## Tech Stack

| | |
|---|---|
| Framework | React 19, React Router 7 |
| State | Redux Toolkit |
| HTTP | Axios |
| Auth | JWT (localStorage) |
| Backend | [api.hellper.dev](https://api.hellper.dev) |
| Tooling | Vite 7, GitHub Pages |

## Setup

```bash
git clone https://github.com/ByteMe6/ContactBook-MaterialExpressive
cd ContactBook-MaterialExpressive
npm install
npm run dev
```

## Deploy

```bash
npm run deploy
```

Deploys to GitHub Pages.
