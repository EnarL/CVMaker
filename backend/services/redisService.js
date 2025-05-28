const redis = require('redis');

class RedisService {
    constructor() {
        this.client = null;
        this.isConnected = false;
        this.SESSION_TTL = 24 * 60 * 60; // 24 hours in seconds
        this.fallbackStorage = new Map(); // In-memory fallback
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
                            console.warn('Redis connection failed after 10 retries, using fallback storage');
                            return false;
                        }
                        return Math.min(retries * 50, 1000);
                    }
                }
            });

            this.client.on('error', (err) => {
                console.warn('Redis error:', err.message);
                this.isConnected = false;
            });

            this.client.on('connect', () => {
                console.log('Redis connected');
                this.isConnected = true;
            });

            this.client.on('disconnect', () => {
                console.warn('Redis disconnected');
                this.isConnected = false;
            });

            await this.client.connect();
            return true;
        } catch (error) {
            console.warn('Redis connection failed, using in-memory fallback:', error.message);
            this.isConnected = false;
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
            const key = `cv:session:${sessionId}`;
            const value = {
                ...cvData,
                lastUpdated: new Date().toISOString(),
                sessionId
            };

            if (this.isConnected && this.client) {
                // Try Redis first
                await this.client.setEx(key, this.SESSION_TTL, JSON.stringify(value));
                return true;
            } else {
                // Fallback to in-memory storage
                console.log('Using fallback storage for session:', sessionId);
                this.fallbackStorage.set(key, {
                    data: value,
                    expiry: Date.now() + (this.SESSION_TTL * 1000)
                });
                return true;
            }
        } catch (error) {
            // Even if Redis fails, use fallback
            console.warn('Redis save failed, using fallback:', error.message);
            const key = `cv:session:${sessionId}`;
            const value = {
                ...cvData,
                lastUpdated: new Date().toISOString(),
                sessionId
            };
            this.fallbackStorage.set(key, {
                data: value,
                expiry: Date.now() + (this.SESSION_TTL * 1000)
            });
            return true;
        }
    }

    async getCV(sessionId) {
        try {
            const key = `cv:session:${sessionId}`;

            if (this.isConnected && this.client) {
                // Try Redis first
                const value = await this.client.get(key);
                if (value) {
                    return JSON.parse(value);
                }
            }

            // Check fallback storage
            const fallbackData = this.fallbackStorage.get(key);
            if (fallbackData) {
                // Check if data has expired
                if (Date.now() > fallbackData.expiry) {
                    this.fallbackStorage.delete(key);
                    return null;
                }
                return fallbackData.data;
            }

            return null;
        } catch (error) {
            console.warn('Error retrieving CV:', error.message);
            // Try fallback storage even if Redis fails
            const key = `cv:session:${sessionId}`;
            const fallbackData = this.fallbackStorage.get(key);
            if (fallbackData && Date.now() <= fallbackData.expiry) {
                return fallbackData.data;
            }
            return null;
        }
    }

    async deleteCV(sessionId) {
        try {
            const key = `cv:session:${sessionId}`;

            if (this.isConnected && this.client) {
                await this.client.del(key);
            }

            // Also remove from fallback
            this.fallbackStorage.delete(key);
            return true;
        } catch (error) {
            console.warn('Error deleting CV:', error.message);
            // At least remove from fallback
            const key = `cv:session:${sessionId}`;
            this.fallbackStorage.delete(key);
            return true;
        }
    }

    async sessionExists(sessionId) {
        try {
            const key = `cv:session:${sessionId}`;

            if (this.isConnected && this.client) {
                const exists = await this.client.exists(key);
                if (exists === 1) return true;
            }

            // Check fallback
            const fallbackData = this.fallbackStorage.get(key);
            return fallbackData && Date.now() <= fallbackData.expiry;
        } catch (error) {
            console.warn('Error checking session:', error.message);
            const key = `cv:session:${sessionId}`;
            const fallbackData = this.fallbackStorage.get(key);
            return fallbackData && Date.now() <= fallbackData.expiry;
        }
    }

    async extendSessionTTL(sessionId) {
        try {
            const key = `cv:session:${sessionId}`;

            if (this.isConnected && this.client) {
                const exists = await this.client.exists(key);
                if (exists) {
                    await this.client.expire(key, this.SESSION_TTL);
                }
            }

            // Extend fallback expiry
            const fallbackData = this.fallbackStorage.get(key);
            if (fallbackData) {
                fallbackData.expiry = Date.now() + (this.SESSION_TTL * 1000);
                this.fallbackStorage.set(key, fallbackData);
            }

            return true;
        } catch (error) {
            console.warn('Error extending session TTL:', error.message);
            return true; // Don't fail on this
        }
    }

    async deleteSession(sessionId) {
        return this.deleteCV(sessionId);
    }

    async getAllSessionKeys() {
        try {
            const keys = [];

            if (this.isConnected && this.client) {
                const redisKeys = await this.client.keys('cv:session:*');
                keys.push(...redisKeys);
            }

            // Add fallback keys
            for (const [key] of this.fallbackStorage) {
                if (key.startsWith('cv:session:') && !keys.includes(key)) {
                    keys.push(key);
                }
            }

            return keys;
        } catch (error) {
            console.warn('Error getting session keys:', error.message);
            // Return fallback keys only
            return Array.from(this.fallbackStorage.keys()).filter(key => key.startsWith('cv:session:'));
        }
    }

    async getSessionStats() {
        try {
            const keys = await this.getAllSessionKeys();
            return {
                totalSessions: keys.length,
                usingFallback: !this.isConnected,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                totalSessions: 0,
                usingFallback: true,
                timestamp: new Date().toISOString()
            };
        }
    }

    async healthCheck() {
        try {
            if (!this.isConnected || !this.client) {
                return {
                    status: 'degraded',
                    message: 'Using in-memory fallback storage',
                    connected: false,
                    fallbackActive: true,
                    timestamp: new Date().toISOString()
                };
            }

            const pong = await this.client.ping();
            return {
                status: 'healthy',
                response: pong,
                connected: this.isConnected,
                fallbackActive: false,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                status: 'degraded',
                error: error.message,
                connected: false,
                fallbackActive: true,
                timestamp: new Date().toISOString()
            };
        }
    }

    // Clean up expired fallback data periodically
    cleanupFallback() {
        const now = Date.now();
        for (const [key, data] of this.fallbackStorage) {
            if (now > data.expiry) {
                this.fallbackStorage.delete(key);
            }
        }
    }
}

module.exports = new RedisService();