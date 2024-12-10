//* Not found error Handler

export const notFoundErrorHandler = (req, res, next) => {
    const error = new Error(`Not found - ${req.originalUrl}`)
    res.status(404)
    next(error)
}

//* Error Handler

// errorMiddleware.js
export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500; // Default to 500 if not set
    res.status(statusCode).json({
        error: err.message || "Internal Server Error",
        stack: process.env.NODE_ENV === "production" ? null : err.stack, // Show stack trace in development
    });
};
