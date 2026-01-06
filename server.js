require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const walletRoutes = require('./routes/wallet');
const rateLimiter = require('./middleware/rateLimiter');
const { errorHandler } = require('./middleware/errorHandler');
const winston = require('winston');

// Logger setup
const logDir = 'logs';
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: path.join(logDir, 'app.log') }),
    new winston.transports.Console()
  ]
});

const app = express();
app.use(express.json());
app.use(helmet());
app.use(rateLimiter);
app.use(morgan('combined', { stream: { write: msg => logger.info(msg.trim()) } }));

app.use('/wallet', walletRoutes);

// Register Tempo routes
const tempoRouter = require('./routes/tempo');
app.use('/api/v1/tempo', tempoRouter);

// Register Contract routes
const contractRouter = require('./routes/contracts');
app.use('/api/v1/contracts', contractRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  minPoolSize: parseInt(process.env.MONGO_POOL_MIN) || 10,
  maxPoolSize: parseInt(process.env.MONGO_POOL_MAX) || 100
}).then(() => {
  logger.info('MongoDB connected');
  app.listen(PORT, () => logger.info(`Server listening on port ${PORT}`));
}).catch(err => {
  logger.error('MongoDB connection failed', err);
  process.exit(1);
});