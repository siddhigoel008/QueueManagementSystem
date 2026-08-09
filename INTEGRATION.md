# Adding the offline-access frontend to queue-backend

## 1. Copy the files
Drop the `public/` folder (kiosk.html, display.html, sms.html) into the root of
your `queue-backend` repo, next to `server.js`:

```
queue-backend/
├── server.js
├── seed.js
├── package.json
├── models/
├── routes/
├── middleware/
├── utils/
├── config/
└── public/            <-- add this
    ├── kiosk.html
    ├── display.html
    └── sms.html
```

## 2. Serve the folder as static files (one line in server.js)
Right now `server.js` has no static file serving, so open a file directly in
the browser (`file:///.../public/kiosk.html`) and it will still work — CORS is
already enabled (`app.use(cors())`), so fetch calls to `http://localhost:5000`
succeed even from a `file://` page.

If you'd rather serve them from the backend itself (so they're reachable at
`http://localhost:5000/kiosk.html` etc. — cleaner for a demo), ask Member 4 to
add this one line in `server.js`, anywhere after `const app = express();`:

```js
app.use(express.static('public'));
```

That's the only backend change needed — no routes, models, or logic touched.

## 3. Run it
```bash
npm run seed     # if you haven't already
npm run dev      # starts backend on port 5000
```
Then open `public/kiosk.html` in a browser (double-click it, or visit
`http://localhost:5000/kiosk.html` if you added the static line above).

## 4. What's real vs. simulated
- **kiosk.html** — fully real. Fetches live `GET /api/services`, creates real
  tokens via `POST /api/tokens`, and listens on Socket.io for live position
  updates.
- **display.html** — fully real. Pulls `GET /api/display/:serviceType` for
  every seeded service and refreshes on `queueUpdated` socket events, with a
  15s fallback poll in case an event is missed.
- **sms.html** — real once you give it a token ID. After a citizen gets a
  token from kiosk.html, copy its `_id` (shown in the browser console log,
  or extend kiosk.html to link out to `sms.html?token=<id>`) and paste it
  into sms.html to watch live status turn into message bubbles. There's no
  real SMS gateway — this is the same live data, presented as an SMS thread,
  which is the honest way to demo "SMS-style" without a paid SMS API.

## 5. If your API response field names differ
I matched field names to your README table (`tokenNumber`, `assignedCounter`,
`peopleAhead`, `estimatedWait`, `status`, `currentToken`, `waitingCount`,
`counter`). If Member 4's actual response JSON uses different keys, open each
HTML file and update the matching `.textContent = ...` lines — everything
else (fetch calls, socket wiring) stays the same.

## 6. Change the backend address for demo day
All three files read `window.API_BASE`, defaulting to
`http://localhost:5000`. If you deploy the backend (Render/Railway per the
README's next steps) and want the frontend pointed at it, set it before the
other scripts load, e.g. add this line near the top of each HTML file's
`<head>`:
```html
<script>window.API_BASE = 'https://your-deployed-backend.onrender.com';</script>
```
