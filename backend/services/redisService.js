const redis = require('redis');

class RedisService {
    constructor() {
        this.client = null;
        this.isConnected = false;
        this.SESSION_TTL = 24 * 60 * 60; // 24 hours in seconds
    }

    async connect() {
        try {
            const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

            this.client = redis.createClient({
                url: redisUrl,
                retry_unfulfilled_commands: true,
                retry_delay_on_failover: 100,
                socket: {
                    reconnectStrategy: (retries) => {
                        if (retries > 10) {
                            return false;
                        }
                        return Math.min(retries * 50, 1000);
                    }
                }
            });

            this.client.on('error', (err) => {
                this.isConnected = false;
            });

            this.client.on('connect', () => {
                this.isConnected = true;
            });

            this.client.on('ready', () => {});
            this.client.on('disconnect', () => {
                this.isConnected = false;
            });

            this.client.on('reconnecting', () => {});

            await this.client.connect();
            return true;
        } catch (error) {
            return false;
        }
    }

    async disconnect() {
        if (this.client) {
            try {
                await this.client.disconnect();
            } catch (error) {
                // Silent fail
            }
        }
    }

    async saveCV(sessionId, cvData) {
        try {
            if (!this.isConnected) {
                throw new Error('Redis not connected');
            }

            const key = `cv:session:${sessionId}`;
            const value = JSON.stringify({
                ...cvData,
                lastUpdated: new Date().toISOString(),
                sessionId
            });

            await this.client.setEx(key, this.SESSION_TTL, value);
            return true;
        } catch (error) {
            throw new Error('Failed to save CV');
        }
    }

    async getCV(sessionId) {
        try {
            if (!this.isConnected) {
                return null;
            }

            const key = `cv:session:${sessionId}`;
            const value = await this.client.get(key);

            return value ? JSON.parse(value) : null;
        } catch (error) {
            throw new Error('Failed to retrieve CV');
        }
    }

    async deleteCV(sessionId) {
        try {
            if (!this.isConnected) {
                throw new Error('Redis not connected');
            }

            const key = `cv:session:${sessionId}`;
            await this.client.del(key);
            return true;
        } catch (error) {
            throw new Error('Failed to delete CV');
        }
    }

    async sessionExists(sessionId) {
        try {
            if (!this.isConnected) {
                return false;
            }

            const key = `cv:session:${sessionId}`;
            const exists = await this.client.exists(key);
            return exists === 1;
        } catch (error) {
            return false;
        }
    }

    async extendSessionTTL(sessionId) {
        try {
            if (!this.isConnected) {
                return false;
            }

            const key = `cv:session:${sessionId}`;
            const exists = await this.client.exists(key);

            if (exists) {
                await this.client.expire(key, this.SESSION_TTL);
            }

            return true;
        } catch (error) {
            return false;
        }
    }

    async deleteSession(sessionId) {
        return this.deleteCV(sessionId);
    }

    async getAllSessionKeys() {
        try {
            if (!this.isConnected) {
                return [];
            }
            return await this.client.keys('cv:session:*');
        } catch (error) {
            return [];
        }
    }

    async getSessionStats() {
        try {
            const keys = await this.getAllSessionKeys();
            return {
                totalSessions: keys.length,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                totalSessions: 0,
                timestamp: new Date().toISOString()
            };
        }
    }

    async healthCheck() {
        try {
            if (!this.isConnected) {
                return {
                    status: 'unhealthy',
                    error: 'Not connected to Redis',
                    connected: false,
                    timestamp: new Date().toISOString()
                };
            }

            const pong = await this.client.ping();
            return {
                status: 'healthy',
                response: pong,
                connected: this.isConnected,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                status: 'unhealthy',
                error: error.message,
                connected: false,
                timestamp: new Date().toISOString()
            };
        }
    }
}

module.exports = new RedisService();
