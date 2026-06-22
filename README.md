# Task Manager API

Учебный проект: Node.js + Express + JSON-хранилище

## Структура проекта

```
task-manager/
├── data/
│   └── tasks.json          # "База данных" — создаётся автоматически
├── src/
│   ├── index.js            # Точка входа, настройка Express
│   ├── routes/
│   │   └── tasks.js        # Все маршруты для задач (CRUD)
│   ├── middleware/
│   │   ├── logger.js       # Логирование запросов
│   │   └── errorHandler.js # Глобальная обработка ошибок
│   └── utils/
│       └── storage.js      # Чтение/запись JSON-файла
└── package.json
```

## Запуск

```bash
npm install
npm run dev     # с автоперезапуском (nodemon)
# или
npm start       # без автоперезапуска
```

## API endpoints

| Метод  | URL               | Описание                     |
|--------|-------------------|------------------------------|
| GET    | /api/tasks        | Все задачи                   |
| GET    | /api/tasks?status=pending | Фильтр по статусу   |
| GET    | /api/tasks/:id    | Одна задача                  |
| POST   | /api/tasks        | Создать задачу               |
| PUT    | /api/tasks/:id    | Обновить задачу (все поля)   |
| PATCH  | /api/tasks/:id    | Обновить задачу (часть полей)|
| DELETE | /api/tasks/:id    | Удалить задачу               |

## Статусы задачи

- `pending` — новая (по умолчанию)
- `in-progress` — в работе
- `done` — выполнена

## Примеры запросов (curl)

### Создать задачу
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Изучить Express", "description": "Роутинг и middleware"}'
```

### Получить все задачи
```bash
curl http://localhost:3000/api/tasks
```

### Получить только pending
```bash
curl "http://localhost:3000/api/tasks?status=pending"
```

### Обновить статус (PATCH — только нужные поля)
```bash
curl -X PATCH http://localhost:3000/api/tasks/<ID> \
  -H "Content-Type: application/json" \
  -d '{"status": "done"}'
```

### Удалить задачу
```bash
curl -X DELETE http://localhost:3000/api/tasks/<ID>
```

## Модель задачи

```json
{
  "id": "uuid-v4",
  "title": "Название задачи",
  "description": "Описание",
  "status": "pending",
  "createdAt": "2026-05-06T10:00:00.000Z",
  "updatedAt": "2026-05-06T10:00:00.000Z"
}
```
