# ContactBook

Веб-приложение записной книжки контактов с JWT-авторизацией, на React с дизайном Material Expressive.

**[Демо](https://byteme6.github.io/ContactBook-MaterialExpressive/)** · [English](./README.md)

## Возможности

- Регистрация и вход по JWT
- Просмотр, добавление и удаление контактов
- Защищённые роуты — страница контактов требует авторизации
- Состояние авторизации хранится в localStorage
- Redux Toolkit для управления состоянием

## Стек

| | |
|---|---|
| Фреймворк | React 19, React Router 7 |
| Состояние | Redux Toolkit |
| HTTP | Axios |
| Авторизация | JWT (localStorage) |
| Бэкенд | [api.hellper.dev](https://api.hellper.dev) |
| Инструменты | Vite 7, GitHub Pages |

## Установка

```bash
git clone https://github.com/ByteMe6/ContactBook-MaterialExpressive
cd ContactBook-MaterialExpressive
npm install
npm run dev
```

## Деплой

```bash
npm run deploy
```

Деплоит на GitHub Pages.
