# Kanban Board Application

A full-stack Kanban board application built with React, TypeScript, and Express. Features include user authentication, ticket management, and real-time updates.

## Features

- User Authentication (JWT)

- Create, Read, Update, Delete tickets
- Drag-and-drop ticket management
- Sort tickets by name or date
- Search functionality
- Responsive design

\Authentication Flow


User enters credentials in Login.tsx
authAPI.tsx makes login request
On success, token stored via auth.ts
useAuth.ts hook manages navigation
ProtectedRoute.tsx enforces authentication

Session Management
Token expiration checked every minute
Automatic logout on token expiration
Navigation to login on authentication failure

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

## Deployment on Render

**Build Instructions:**

- **Server:** Navigate to the `server` directory and run `npm run build`. This compiles the TypeScript source into the `dist` folder, generating the production-ready code.

- **Client:** Navigate to the `client` directory and run `npm run build` (usually with Vite). This produces the production assets in `client/dist`.

**Start Instructions:**

- Ensure that in your `render.yaml`, the start command is set to `node server/dist/server.js` (or the appropriate entry point) for starting the server.

**Environment Variables:**

- These must be configured in the Render dashboard: 
  - `NODE_ENV` should be set to `production`.
  - `DATABASE_URL` must be provided and correctly formatted.
  - `JWT_SECRET` should be defined for authentication.
  - `PORT` as required by your application.
- DOGGY: These files contain local settings that should not be used in production. Ensure Render injects secure environment variables.

**Note:** All instructions here must match the commands in your `package.json` and `render.yaml` so that your deployments reflect the current build and start processes. If these instructions are outdated or misaligned, deployment on Render may fail.

## License

MIT