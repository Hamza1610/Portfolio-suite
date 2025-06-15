import winston from 'winston';
import dotenv from 'dotenv';

dotenv.config();

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// Log error messages
export const error = (message: string, meta?: any): void => {
  logger.error(message, meta);
};

// Log warning messages
export const warn = (message: string, meta?: any): void => {
  logger.warn(message, meta);
};

// Log info messages
export const info = (message: string, meta?: any): void => {
  logger.info(message, meta);
};

// Log debug messages
export const debug = (message: string, meta?: any): void => {
  logger.debug(message, meta);
}; 