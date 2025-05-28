const { v4: uuidv4 } = require('uuid');
const redisService = require('../services/redisService');

class SessionMiddleware {

    async createOrGetSession(req, res, next) {
        try {
            let sessionId = req.cookies?.cv_session;

            if (!sessionId) {
                sessionId = uuidv4();

                res.cookie('cv_session', sessionId, {
                    maxAge: 24 * 60 * 60 * 1000, // 24 hours
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax'
                });

                console.log('Created new session:', sessionId);
            }
            req.sessionId = sessionId;

            await redisService.extendSessionTTL(sessionId);

            next();
        } catch (error) {
            console.error('Session middleware error:', error);
            next(error);
        }
    }
}

module.exports = new SessionMiddleware();