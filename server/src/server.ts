import app from './app';
import { env } from './config/env';
import { prisma } from './config/database';

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const port = env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`App running on port ${port} in ${env.NODE_ENV} mode...`);
});

// Check DB Connection
prisma.$connect()
  .then(() => {
    console.log('DB Connection successful!');
  })
  .catch((err) => {
    console.error('DB Connection failed!', err);
  });

process.on('unhandledRejection', (err: any) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
