# Shared Todo List Application

A full-stack todo list application built with NestJS, TypeScript, PostgreSQL, and vanilla CSS. This application allows users to create and share todos with other users.

## Features

- User registration and login
- Create, read, update, and delete todos
- Assign todos to other users
- Mark todos as complete/incomplete
- View todos assigned to you and created by you
- Responsive design with vanilla CSS

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd shared-todo-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up PostgreSQL:
- Create a new database named `shared_todo`
- Update the database configuration in `src/app.module.ts` if your credentials are different

4. Start the application:
```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

5. Open the application in your browser:
- Navigate to `http://localhost:3000` for the API
- Navigate to `http://localhost:3000/public/index.html` for the frontend

## API Endpoints

### Users
- POST `/users` - Create a new user
- GET `/users` - Get all users
- GET `/users/:id` - Get a specific user
- PUT `/users/:id` - Update a user
- DELETE `/users/:id` - Delete a user

### Todos
- POST `/todos` - Create a new todo
- GET `/todos` - Get all todos
- GET `/todos/:id` - Get a specific todo
- GET `/todos/user/:userId` - Get todos for a specific user
- PUT `/todos/:id` - Update a todo
- PUT `/todos/:id/toggle` - Toggle todo completion status
- DELETE `/todos/:id` - Delete a todo

## Project Structure

```
shared-todo-app/
├── src/
│   ├── user/
│   │   ├── user.controller.ts
│   │   ├── user.entity.ts
│   │   ├── user.module.ts
│   │   └── user.service.ts
│   ├── todo/
│   │   ├── todo.controller.ts
│   │   ├── todo.entity.ts
│   │   ├── todo.module.ts
│   │   └── todo.service.ts
│   ├── app.module.ts
│   └── main.ts
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── package.json
├── tsconfig.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 