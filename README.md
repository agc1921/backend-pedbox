# PedBox - Backend (Rick and Morty API)

Backend en NestJS + TypeORM + PostgreSQL que consume la Rick and Morty API,
normaliza sus datos en una BD relacional, y expone una API REST propia
protegida con JWT.

## Stack
- NestJS + TypeScript
- TypeORM + PostgreSQL (Docker)
- JWT (passport-jwt) + bcrypt
- Jest (pruebas unitarias)

## Instalación

1. Instala dependencias:
```bash
npm install
```

2. Copia las variables de entorno:
```bash
cp .env.example .env
```

Variables necesarias (ver `.env.example`):

| Variable | Descripción |
|---|---|
| `PORT` | Puerto donde corre el backend (default 3000) |
| `NODE_ENV` | `development` o `production` |
| `DB_HOST` | Host de la base de datos (localhost con Docker) |
| `DB_PORT` | Puerto de Postgres (5432) |
| `DB_USER` | Usuario de la base de datos |
| `DB_PASSWORD` | Password de la base de datos |
| `DB_NAME` | Nombre de la base de datos |
| `JWT_SECRET` | Clave secreta para firmar los tokens JWT |

3. Levanta la base de datos con Docker:
```bash
docker compose up -d
```

## Correr en desarrollo

```bash
npm run start:dev
```

Todas las rutas quedan bajo el prefijo `/api` (ej. `http://localhost:3000/api/...`).

carga la base de datos con los datos de Rick and Morty (una sola vez, tarda unos minutos):
```bash
curl -X POST http://localhost:3000/api/seed
```

## Nota
```bash
npm run build
```
Si el npm run build no funciona eliminar el archivo "tsconfig.build.tsbuildinfo"

## Pruebas unitarias

```bash
npm run test
```

Incluye pruebas de `auth`, `users` y `characters` (services y controllers)

## Endpoints

### Auth (públicos)
- `POST /api/auth/register` — body: `{ "email": "...", "password": "..." }`
- `POST /api/auth/login` — body: `{ "email": "...", "password": "..." }` → devuelve `{ access_token }`
- `POST /api/seed` — puebla la BD desde Rick and Morty API (sin auth, se puede correr varias veces sin duplicar)

### Datos (protegidos, requieren header `Authorization: Bearer <token>`)
- `GET /api/characters?page=1&limit=10&search=rick&sortBy=name&order=DESC`
- `GET /api/characters/:id`
- `GET /api/locations?page=1&limit=10&search=earth&sortBy=name&order=ASC`
- `GET /api/locations/:id`
- `GET /api/episodes?page=1&limit=10&search=pilot&sortBy=airDate&order=DESC`
- `GET /api/episodes/:id`

Todos los endpoints de listado soportan `page`, `limit`, `search` (filtra por nombre) y `sortBy`/`order` (ordenamiento) como parámetros opcionales.

## Modelo de datos

- `locations` 1:N `characters` (una location tiene muchos characters)
- `characters` N:M `episodes` (tabla pivote `character_episode`, generada automáticamente por TypeORM)
- `users` — tabla independiente, solo para autenticación
