# Testing — Smart Citizen Queue Management System

Test cases run against the backend API (`npm run dev`, port 5000) after seeding
(`npm run seed`). Run these before every demo/checkpoint to confirm nothing's broken.

Seeded accounts: `STAFF001` / `staff123` (counter INC-1), `SUP001` / `super123`.
Seeded services: `BIRTH`, `INC`, `WELFARE`.

---

## 1. Citizen flow — happy path (repeat for all 3 services)

| Step | Request | Expected result |
|---|---|---|
| 1.1 | `GET /api/services` | Returns all 3 seeded services with `avgServiceTimeMinutes` |
| 1.2 | `POST /api/tokens` `{serviceType:"INC", citizenName:"Test Citizen"}` | 201, returns token with `tokenNumber`, `status:"waiting"`, an `_id` |
| 1.3 | `GET /api/tokens/:id/status` | Returns `peopleAhead` and `estimatedWait`, matches formula: people ahead × avg service time |
| 1.4 | Repeat 1.2–1.3 for `BIRTH` and `WELFARE` | Each queue tracked independently — a token in one service must not affect another service's `peopleAhead` |

## 2. Staff actions (needs STAFF001 login)

| Step | Request | Expected result |
|---|---|---|
| 2.1 | `POST /api/auth/login` `{employeeId:"STAFF001", password:"staff123"}` | 200, returns JWT |
| 2.2 | `GET /api/staff/queue/INC` (with token) | Returns waiting tokens for INC, priority-sorted |
| 2.3 | `POST /api/staff/tokens/:id/call` | Token status → `called`; `queueUpdated` socket event fires for room `service:INC` |
| 2.4 | `POST /api/staff/tokens/:id/complete` | Token status → `completed` |
| 2.5 | `POST /api/staff/tokens/:id/skip` `{reason:"no-show"}` | Token status → `skipped`; audit record created with the reason |
| 2.6 | `POST /api/staff/tokens/:id/priority` `{priorityCategory:"senior", reason:"accessibility"}` | Token's priority updates; audit record created; token re-sorts ahead of FCFS tokens |
| 2.7 | `POST /api/staff/tokens/:id/redirect` `{newCounter:"BIRTH-1", reason:"counter overload"}` | Token's `assignedCounter` updates; audit record created |
| 2.8 | Repeat 2.3 without a login token (no `Authorization` header) | Must be rejected (401) — staff actions should never work unauthenticated |

## 3. Priority rules (Member 5's logic, verified end-to-end)

| Step | Scenario | Expected result |
|---|---|---|
| 3.1 | Citizen self-selects priority at join time (`POST /api/tokens` with a priority field, if the frontend exposes one) | Must be ignored/rejected — priority can only be staff-assigned, never citizen-selected |
| 3.2 | Staff assigns `senior` or `disability` priority | Token moves ahead of FCFS tokens in `GET /api/staff/queue/:serviceType` |
| 3.3 | Staff assigns priority without a `reason` | Should be rejected — no silent priority change is allowed |
| 3.4 | Estimated wait after a priority reorder | Recalculates correctly for citizens now behind the reprioritized token |

## 4. Supervisor view (needs SUP001 login)

| Step | Request | Expected result |
|---|---|---|
| 4.1 | `GET /api/supervisor/overview` | Shows all counters, queue lengths, and flags any counter as overloaded per its threshold |
| 4.2 | `GET /api/supervisor/audit/:tokenId` | Returns full audit trail for a token that had a priority change + redirect (from tests 2.6/2.7) |
| 4.3 | Login as STAFF001 and call a supervisor-only endpoint | Must be rejected (403) — role check enforced |

## 5. Public display board

| Step | Request | Expected result |
|---|---|---|
| 5.1 | `GET /api/display/INC` | Shows currently-called/serving token only, not the full waiting queue |
| 5.2 | Call a new token via staff dashboard, then re-check 5.1 | Display reflects the new "now serving" token without a manual refresh (via socket) |

## 6. Real-time updates (Socket.io)

| Step | Scenario | Expected result |
|---|---|---|
| 6.1 | Two clients join `service:INC` room, one calls a token | Both clients receive `queueUpdated` |
| 6.2 | Client joins `service:BIRTH` room only | Does NOT receive `queueUpdated` events for `INC` actions |
| 6.3 | Client disconnects mid-session, reconnects | Rejoining the room resumes live updates |

## 7. Edge cases

| Step | Scenario | Expected result |
|---|---|---|
| 7.1 | `POST /api/tokens` with an invalid `serviceType` | Rejected with a clear error, no token created |
| 7.2 | `GET /api/tokens/:id/status` with a non-existent id | 404, not a server crash |
| 7.3 | Join a queue with 0 counters currently free for that service | Token still queues; `estimatedWait` reflects the backlog |
| 7.4 | Two citizens join the same service within the same second | Both get distinct, sequential token numbers — no collision |

---

## How to log results
For each run: date, backend commit/version, pass/fail per section, and any bug filed
back to Member 4 with the exact request/response that failed. Keep this file updated
as the single source of truth for "is the demo safe to run right now."
