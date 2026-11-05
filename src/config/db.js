const mongoose = require('mongoose');

/**
 * Abre la conexión con MongoDB usando MONGODB_URI.
 * Lanza un error descriptivo si la configuración falta o la conexión falla.
 */
const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MONGODB_URI no está definida. Configura la variable en el archivo .env');
  }

  mongoose.set('strictQuery', true);

  const connection = await mongoose.connect(mongoUri, {
    autoIndex: process.env.NODE_ENV !== 'production',
    serverSelectionTimeoutMS: 10000
  });

  console.log(`MongoDB conectado: ${connection.connection.host}`);
  return connection;
};

const disconnectDB = async () => {
  await mongoose.disconnect();
};

module.exports = { connectDB, disconnectDB };
