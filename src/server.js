require('dotenv').config();

const app = require('./app');
const { connectDB, disconnectDB } = require('./config/db');

const PORT = Number(process.env.PORT) || 3000;

const start = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });

    const shutdown = async (signal) => {
      console.log(`\n${signal} recibido. Cerrando servidor...`);
      server.close(async () => {
        await disconnectDB();
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    console.error('No se pudo iniciar el servidor:', error.message);
    process.exit(1);
  }
};

process.on('unhandledRejection', (reason) => {
  console.error('Promesa rechazada sin manejar:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Excepción no controlada:', error);
  process.exit(1);
});

start();
