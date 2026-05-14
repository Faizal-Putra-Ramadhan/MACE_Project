import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error('CRITICAL ERROR: DATABASE_URL environment variable is not defined.');
}

const sequelize = new Sequelize(dbUrl || 'postgres://localhost:5432/dummy', {
  dialect: 'postgres',
  dialectOptions: {
    ssl: dbUrl ? {
      require: true,
      rejectUnauthorized: false
    } : false
  },
  logging: false,
  pool: {
    max: 3,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

export default sequelize;
