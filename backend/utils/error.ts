import { Response } from "express";

export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message); // Pass message to base Error class
    this.statusCode = statusCode; // HTTP status code
    this.isOperational = isOperational; // Distinguish expected vs unexpected errors

    Error.captureStackTrace(this, this.constructor); // Clean stack trace
  }
}

interface ErrorSerializerOptions {
  message?: string;
  statusCode?: number;
  error?: any;
}

/**
 * Standardized error serializer for controllers
 * Deletes uploaded files if present and sends consistent JSON response
 */

export const serializeError = async (
  res: Response,
  options: ErrorSerializerOptions
) => {
  const { message: customMessage, statusCode: customStatus } = options ?? {};

  // message
  const message = customMessage || "Something went wrong. Please try again";

  // status code
  const statusCode = customStatus || 500;

  res.status(statusCode).json({
    // success: false,    // need to confirm if required or not ?
    statusCode,
    data: {},
    message,
  });
};
