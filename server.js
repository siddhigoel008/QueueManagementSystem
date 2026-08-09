require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const citizenRoutes = require('./routes/citizenRoutes');
const staffRoutes = require('./routes/staffRoutes');
const supervisorRoutes = require('./routes/supervisorRoutes');
const displayRoutes = require('./routes/displayRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Make io reachable inside route files via req.app.get('io')
app.set('io', io);

app.use(cors({
    origin: 'http://localhost:5171'
}));
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api', citizenRoutes); // gives /api/services, /api/tokens, /api/tokens/:id/status
app.use('/api/staff', staffRoutes);
app.use('/api/supervisor', supervisorRoutes);
app.use('/api/display', displayRoutes);

app.get('/', (req, res) => {
  res.send('Queue Management Backend is running');
});

// Socket.io: frontends join a "room" per service so updates only go to relevant screens
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('joinServiceRoom', (serviceType) => {
    socket.join(`service:${serviceType}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
