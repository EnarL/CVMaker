class ErrorHandler {
    handleErrors(error, req, res, next) {
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            url: req.url,
            method: req.method,
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            sessionId: req.sessionId,
            timestamp: new Date().toISOString()
        });

        let statusCode = 500;
        let message = 'Internal server error';

        if (error.message?.includes('Redis')) {
            statusCode = 503;
            message = 'Service temporarily unavailable. Please try again later.';
        }


        if (error.name === 'ValidationError') {
            statusCode = 400;
            message = error.message;
        }


        if (error.code === 'ETIMEDOUT') {
            statusCode = 504;
            message = 'Request timeout. Please try again.';
        }

        if (error.statusCode) {
            statusCode = error.statusCode;
            message = error.message;
        }

        res.status(statusCode).json({
            success: false,
            message,
            ...(process.env.NODE_ENV === 'development' && {
                stack: error.stack,
                error: error.message
            })
        });
    }
    handleNotFound(req, res) {
        res.status(404).json({
            success: false,
            message: `Route ${req.originalUrl} not found`,
            availableRoutes: {
                'GET /api': 'API documentation',
                'GET /api/health': 'Health check',
                'GET /api/cv': 'Get CV',
                'POST /api/cv': 'Save CV',
            }
        });
    }
    handleUnhandledRejection(reason, promise) {
        console.error('Unhandled Rejection at:', promise, 'reason:', reason);
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1);
        }
    }

    handleUncaughtException(error) {
        console.error('Uncaught Exception:', error);
        // Graceful shutdown
        process.exit(1);
    }
}

module.exports = new ErrorHandler();