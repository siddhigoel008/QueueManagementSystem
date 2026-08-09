require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');

const ServiceType = require('./models/ServiceType');
const Counter = require('./models/Counter');
const User = require('./models/User');

async function seed() {
  await connectDB();

  // Clear existing data so this script is safe to re-run anytime during development
  await ServiceType.deleteMany({});
  await Counter.deleteMany({});
  await User.deleteMany({});

  await ServiceType.insertMany([
    { code: 'BIRTH', name: 'Birth/Death Certificate', avgServiceTimeMinutes: 6 },
    { code: 'INC', name: 'Income/Domicile Certificate', avgServiceTimeMinutes: 5 },
    { code: 'WELFARE', name: 'Welfare-Scheme Enquiry', avgServiceTimeMinutes: 8 }
  ]);

  await Counter.insertMany([
    { counterNumber: 'BIRTH-1', serviceType: 'BIRTH' },
    { counterNumber: 'INC-1', serviceType: 'INC' },
    { counterNumber: 'WELFARE-1', serviceType: 'WELFARE' }
  ]);

  const hashedStaffPassword = await bcrypt.hash('staff123', 10);
  const hashedSupervisorPassword = await bcrypt.hash('super123', 10);

  await User.insertMany([
    {
      name: 'Ramesh Kumar',
      employeeId: 'STAFF001',
      password: hashedStaffPassword,
      role: 'staff',
      assignedCounter: 'INC-1'
    },
    {
      name: 'Anita Sharma',
      employeeId: 'SUP001',
      password: hashedSupervisorPassword,
      role: 'supervisor'
    }
  ]);

  console.log('Seed data created successfully.');
  console.log('Staff login   -> employeeId: STAFF001, password: staff123');
  console.log('Supervisor login -> employeeId: SUP001, password: super123');

  mongoose.connection.close();
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
