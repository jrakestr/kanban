# Kanban Board Application

A full-stack Kanban board application built with React, TypeScript, and Express. Features include user authentication, ticket management, and real-time updates.

## Features

- User Authentication (JWT)

- Create, Read, Update, Delete tickets
- Drag-and-drop ticket management
- Sort tickets by name or date
- Search functionality
- Responsive design

## Tech Stack

### Frontend
- React with TypeScript
- Vite
- Modern CSS

### Backend
- Node.js with Express
- TypeScript
- Sequelize ORM
- PostgreSQL

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/jrakestr/kanban.git
cd kanban
```

2. Install dependencies:
```bash
npm install
cd client && npm install
cd ../server && npm install
```

3. Set up environment variables:
- Copy `.env.EXAMPLE` to `.env`
- Update the values as needed

4. Start the development servers:
```bash
npm start
```

## Deployment

This application is configured for deployment on Render.com using the provided `render.yaml` configuration file.

### Deployment Steps

1. Fork this repository
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Render will automatically deploy your application

## License

MIT