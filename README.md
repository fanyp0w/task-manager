# Task Manager

Simple task manager built with Node.js and Express. Includes a REST API and a minimal web UI.

## Features

- CRUD operations for tasks (create, read, update, delete)
- Filter tasks by status (all / in progress / done)
- Priority levels: high, medium, low
- Task statistics endpoint
- Rate limiting and request logging middleware
- JSON file storage (`tasks.json`, created automatically)

## Requirements

- Node.js 18+ (for `node --watch` in dev mode)

## Setup

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

For development with auto-reload:

```bash
npm run dev
```

On first run, the app seeds sample tasks if the database is empty.

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List tasks (`?done=true/false`, `?priority=high/medium/low`) |
| GET | `/api/tasks/stats` | Task statistics |
| GET | `/api/tasks/:id` | Get task by ID |
| POST | `/api/tasks` | Create task (`title` required) |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

## Project structure

```
task-manager/
├── index.js        # Express server and routes
├── tasks.js        # Data layer (JSON file storage)
├── middleware.js   # Rate limiter and logger
├── public/
│   └── index.html  # Web UI
└── package.json
```

## License

MIT
