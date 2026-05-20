require('dotenv').config();

const { connectDB } = require('../config/database');
const AccountAdmin = require('../models/AccountAdmin');
const AccountUser = require('../models/AccountUser');

async function upsertUser() {
  const email = 'customer@copypro.vn';
  let account = await AccountUser.findOne({ email }).select('+password');

  if (!account) {
    account = new AccountUser({
      name: 'Demo Customer',
      email,
      password: 'customer123',
      status: 'active',
      isVerified: true,
    });
  } else {
    account.name = 'Demo Customer';
    account.password = 'customer123';
    account.status = 'active';
    account.isVerified = true;
  }

  await account.save();
  return account;
}

async function upsertAdmin() {
  const email = 'admin@copypro.vn';
  let account = await AccountAdmin.findOne({ email }).select('+password');

  if (!account) {
    account = new AccountAdmin({
      name: 'Demo Admin',
      email,
      password: 'admin123',
      adminRole: 'super_admin',
      status: 'active',
    });
  } else {
    account.name = 'Demo Admin';
    account.password = 'admin123';
    account.adminRole = 'super_admin';
    account.status = 'active';
  }

  await account.save();
  return account;
}

async function seed() {
  await connectDB();
  const [user, admin] = await Promise.all([upsertUser(), upsertAdmin()]);

  console.log(`Seeded AccountUser: ${user.email}`);
  console.log(`Seeded AccountAdmin: ${admin.email}`);
}

seed()
  .then(() => {
    console.log('Seed completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seed failed:', error.message);
    process.exit(1);
  });
