# Smart Citizen Queue Management System — Backend

## What each folder does
- `models/` — the 5 database tables (as Mongoose schemas): User, ServiceType, Counter, Token, AuditLog
- `routes/` — the API endpoints, grouped by who calls them (citizen / staff / supervisor / display / auth)
- `middleware/` — checks that a request has a valid login token and the right role before running
- `utils/` — small reusable functions (priority sorting, wait-time math, token numbering)
- `config/db.js` — connects to MongoDB
- `server.js` — starts everything: Express, MongoDB, Socket.io, and mounts all the routes
- `seed.js` — fills the database with sample services, counters, and login accounts so you're not demoing an empty app

## Setup (do this first)

1. **Install Node.js** if you don't have it: https://nodejs.org (LTS version)

2. **Get a free MongoDB database**: go to https://www.mongodb.com/cloud/atlas, create a free cluster,
   click "Connect" → "Drivers", and copy the connection string. It looks like:
   `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/`

3. **Install dependencies**:
   ```bash
   cd queue-backend
   npm install
   ```

4. **Create your `.env` file**:
   ```bash
   cp .env.example .env
   ```
   Then open `.env` and paste in your real MongoDB connection string, and set `JWT_SECRET` to any
   random long string (mash your keyboard, it just needs to be unpredictable).

5. **Seed the database** (creates sample services, counters, and login accounts):
   ```bash
   npm run seed
   ```
   This prints staff/supervisor login credentials to your terminal — save them, your teammates will need them.

6. **Start the server**:
   ```bash
   npm run dev
   ```
   You should see `MongoDB connected` and `Server running on port 5000`.

7. **Test it's alive**: open `http://localhost:5000` in a browser — you should see
   "Queue Management Backend is running".

## Testing your API before frontend is ready

Use Postman, Insomnia, or even `curl`. Example flow:

```bash
# 1. List services
curl http://localhost:5000/api/services

# 2. Citizen joins a queue
curl -X POST http://localhost:5000/api/tokens \
  -H "Content-Type: application/json" \
  -d '{"serviceType":"INC","citizenName":"Test Citizen"}'
# Copy the "_id" from the response for step 3

# 3. Check status
curl http://localhost:5000/api/tokens/<paste_id_here>/status

# 4. Staff login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"employeeId":"STAFF001","password":"staff123"}'
# Copy the "token" from the response for step 5

# 5. Staff calls the next citizen (needs the login token from step 4)
curl -X POST http://localhost:5000/api/staff/tokens/<paste_id_here>/call \
  -H "Authorization: Bearer <paste_login_token_here>"
```

## Full API reference

### Citizen-facing (no login required)
| Method | Endpoint | Body | Purpose |
|---|---|---|---|
| GET | `/api/services` | — | List all departments |
| POST | `/api/tokens` | `{ serviceType, citizenName }` | Join a queue, get a token |
| GET | `/api/tokens/:id/status` | — | Live position + wait time |

### Staff dashboard (needs staff or supervisor login)
| Method | Endpoint | Body | Purpose |
|---|---|---|---|
| GET | `/api/staff/queue/:serviceType` | — | Waiting tokens, priority-sorted |
| POST | `/api/staff/tokens/:id/call` | — | Call this token to counter |
| POST | `/api/staff/tokens/:id/complete` | — | Mark as done |
| POST | `/api/staff/tokens/:id/skip` | `{ reason }` | Skip a no-show (audited) |
| POST | `/api/staff/tokens/:id/priority` | `{ priorityCategory, reason }` | Change priority (audited) |
| POST | `/api/staff/tokens/:id/redirect` | `{ newCounter, reason }` | Move to another counter (audited) |

### Supervisor only
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/supervisor/overview` | All counters + queue lengths + overload flags |
| GET | `/api/supervisor/audit/:tokenId` | Full change history for a token |

### Public display board (no login required)
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/display/:serviceType` | Currently-called/serving tokens |

### Auth
| Method | Endpoint | Body | Purpose |
|---|---|---|---|
| POST | `/api/auth/login` | `{ employeeId, password }` | Staff/supervisor login, returns JWT |

## Real-time updates (Socket.io)

Frontend connects to the server via Socket.io, then sends:
```js
socket.emit('joinServiceRoom', 'INC'); // join updates for the Income Certificate queue
socket.on('queueUpdated', (data) => {
  // re-fetch the queue or token status here
});
```
Every action that changes a token's status (join, call, complete, skip, priority change, redirect)
automatically broadcasts a `queueUpdated` event to everyone watching that service — this is what makes
the public display and citizen wait screen update live without refreshing.

## Seeded test accounts (from `npm run seed`)
- Staff: `STAFF001` / `staff123` (assigned to counter INC-1)
- Supervisor: `SUP001` / `super123`

## Next steps for you
1. Run through the setup above and confirm the server starts.
2. Run the `curl` test flow above to see the whole citizen → staff → status update cycle work end to end.
3. Share this README's API table with Member 2 and Member 3 so they know exactly what to call.
4. Deploy to Render or Railway once the core flow works locally (both have free tiers and support Node + env vars).
