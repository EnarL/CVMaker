const RedisService = require('../services/redisService');
const redis = require('redis');

// Mock Redis
jest.mock('redis', () => ({
    createClient: jest.fn(() => ({
        connect: jest.fn(),
        disconnect: jest.fn(),
        setEx: jest.fn(),
        get: jest.fn(),
        del: jest.fn(),
        exists: jest.fn(),
        expire: jest.fn(),
        keys: jest.fn(),
        ping: jest.fn(),
        on: jest.fn()
    }))
}));

describe('RedisService', () => {
    let mockClient;

    beforeEach(() => {
        jest.clearAllMocks();
        mockClient = {
            connect: jest.fn(),
            disconnect: jest.fn(),
            setEx: jest.fn(),
            get: jest.fn(),
            del: jest.fn(),
            exists: jest.fn(),
            expire: jest.fn(),
            keys: jest.fn(),
            ping: jest.fn(),
            on: jest.fn()
        };
        redis.createClient.mockReturnValue(mockClient);

        // Reset service state
        RedisService.client = null;
        RedisService.isConnected = false;
    });

    describe('connect', () => {
        it('should connect successfully', async () => {
            mockClient.connect.mockResolvedValue(true);

            const result = await RedisService.connect();

            expect(redis.createClient).toHaveBeenCalled();
            expect(mockClient.connect).toHaveBeenCalled();
            expect(result).toBe(true);
        });

        it('should handle connection errors', async () => {
            mockClient.connect.mockRejectedValue(new Error('Connection failed'));

            const result = await RedisService.connect();

            expect(result).toBe(false);
        });

        it('should set up event listeners', async () => {
            mockClient.connect.mockResolvedValue(true);

            await RedisService.connect();

            expect(mockClient.on).toHaveBeenCalledWith('error', expect.any(Function));
            expect(mockClient.on).toHaveBeenCalledWith('connect', expect.any(Function));
            expect(mockClient.on).toHaveBeenCalledWith('ready', expect.any(Function));
            expect(mockClient.on).toHaveBeenCalledWith('disconnect', expect.any(Function));
            expect(mockClient.on).toHaveBeenCalledWith('reconnecting', expect.any(Function));
        });
    });

    describe('disconnect', () => {
        it('should disconnect successfully', async () => {
            RedisService.client = mockClient;
            mockClient.disconnect.mockResolvedValue(true);

            await RedisService.disconnect();

            expect(mockClient.disconnect).toHaveBeenCalled();
        });

        it('should handle disconnect errors silently', async () => {
            RedisService.client = mockClient;
            mockClient.disconnect.mockRejectedValue(new Error('Disconnect failed'));

            await expect(RedisService.disconnect()).resolves.not.toThrow();
        });
    });

    describe('saveCV', () => {
        const sessionId = 'test-session';
        const cvData = { personalInfo: { fullName: 'John' } };

        beforeEach(() => {
            RedisService.client = mockClient;
            RedisService.isConnected = true;
        });

        it('should save CV successfully', async () => {
            mockClient.setEx.mockResolvedValue(true);

            const result = await RedisService.saveCV(sessionId, cvData);

            expect(mockClient.setEx).toHaveBeenCalledWith(
                `cv:session:${sessionId}`,
                RedisService.SESSION_TTL,
                expect.stringContaining('"fullName":"John"')
            );
            expect(result).toBe(true);
        });

        it('should throw error when not connected', async () => {
            RedisService.isConnected = false;

            await expect(RedisService.saveCV(sessionId, cvData))
                .rejects.toThrow('Failed to save CV');
        });

        it('should handle Redis errors', async () => {
            mockClient.setEx.mockRejectedValue(new Error('Redis error'));

            await expect(RedisService.saveCV(sessionId, cvData))
                .rejects.toThrow('Failed to save CV');
        });
    });

    describe('getCV', () => {
        const sessionId = 'test-session';

        beforeEach(() => {
            RedisService.client = mockClient;
            RedisService.isConnected = true;
        });

        it('should retrieve CV successfully', async () => {
            const cvData = { personalInfo: { fullName: 'John' } };
            mockClient.get.mockResolvedValue(JSON.stringify(cvData));

            const result = await RedisService.getCV(sessionId);

            expect(mockClient.get).toHaveBeenCalledWith(`cv:session:${sessionId}`);
            expect(result).toEqual(cvData);
        });

        it('should return null when CV not found', async () => {
            mockClient.get.mockResolvedValue(null);

            const result = await RedisService.getCV(sessionId);

            expect(result).toBeNull();
        });

        it('should return null when not connected', async () => {
            RedisService.isConnected = false;

            const result = await RedisService.getCV(sessionId);

            expect(result).toBeNull();
        });

        it('should handle Redis errors', async () => {
            mockClient.get.mockRejectedValue(new Error('Redis error'));

            await expect(RedisService.getCV(sessionId))
                .rejects.toThrow('Failed to retrieve CV');
        });
    });

    describe('deleteCV', () => {
        const sessionId = 'test-session';

        beforeEach(() => {
            RedisService.client = mockClient;
            RedisService.isConnected = true;
        });

        it('should delete CV successfully', async () => {
            mockClient.del.mockResolvedValue(1);

            const result = await RedisService.deleteCV(sessionId);

            expect(mockClient.del).toHaveBeenCalledWith(`cv:session:${sessionId}`);
            expect(result).toBe(true);
        });

        it('should throw error when not connected', async () => {
            RedisService.isConnected = false;

            await expect(RedisService.deleteCV(sessionId))
                .rejects.toThrow('Failed to delete CV');
        });
    });

    describe('sessionExists', () => {
        const sessionId = 'test-session';

        beforeEach(() => {
            RedisService.client = mockClient;
            RedisService.isConnected = true;
        });

        it('should return true when session exists', async () => {
            mockClient.exists.mockResolvedValue(1);

            const result = await RedisService.sessionExists(sessionId);

            expect(result).toBe(true);
        });

        it('should return false when session does not exist', async () => {
            mockClient.exists.mockResolvedValue(0);

            const result = await RedisService.sessionExists(sessionId);

            expect(result).toBe(false);
        });

        it('should return false when not connected', async () => {
            RedisService.isConnected = false;

            const result = await RedisService.sessionExists(sessionId);

            expect(result).toBe(false);
        });
    });

    describe('extendSessionTTL', () => {
        const sessionId = 'test-session';

        beforeEach(() => {
            RedisService.client = mockClient;
            RedisService.isConnected = true;
        });

        it('should extend TTL for existing session', async () => {
            mockClient.exists.mockResolvedValue(1);
            mockClient.expire.mockResolvedValue(true);

            const result = await RedisService.extendSessionTTL(sessionId);

            expect(mockClient.expire).toHaveBeenCalledWith(
                `cv:session:${sessionId}`,
                RedisService.SESSION_TTL
            );
            expect(result).toBe(true);
        });

        it('should not extend TTL for non-existent session', async () => {
            mockClient.exists.mockResolvedValue(0);

            const result = await RedisService.extendSessionTTL(sessionId);

            expect(mockClient.expire).not.toHaveBeenCalled();
            expect(result).toBe(true);
        });
    });

    describe('getAllSessionKeys', () => {
        beforeEach(() => {
            RedisService.client = mockClient;
            RedisService.isConnected = true;
        });

        it('should return all session keys', async () => {
            const keys = ['cv:session:1', 'cv:session:2'];
            mockClient.keys.mockResolvedValue(keys);

            const result = await RedisService.getAllSessionKeys();

            expect(mockClient.keys).toHaveBeenCalledWith('cv:session:*');
            expect(result).toEqual(keys);
        });

        it('should return empty array when not connected', async () => {
            RedisService.isConnected = false;

            const result = await RedisService.getAllSessionKeys();

            expect(result).toEqual([]);
        });
    });

    describe('getSessionStats', () => {
        beforeEach(() => {
            RedisService.client = mockClient;
            RedisService.isConnected = true;
        });

        it('should return session statistics', async () => {
            const keys = ['cv:session:1', 'cv:session:2', 'cv:session:3'];
            mockClient.keys.mockResolvedValue(keys);

            const result = await RedisService.getSessionStats();

            expect(result.totalSessions).toBe(3);
            expect(result.timestamp).toBeDefined();
        });

        it('should handle errors gracefully', async () => {
            mockClient.keys.mockRejectedValue(new Error('Redis error'));

            const result = await RedisService.getSessionStats();

            expect(result.totalSessions).toBe(0);
            expect(result.timestamp).toBeDefined();
        });
    });

    describe('healthCheck', () => {
        beforeEach(() => {
            RedisService.client = mockClient;
        });

        it('should return healthy status when connected', async () => {
            RedisService.isConnected = true;
            mockClient.ping.mockResolvedValue('PONG');

            const result = await RedisService.healthCheck();

            expect(result.status).toBe('healthy');
            expect(result.response).toBe('PONG');
            expect(result.connected).toBe(true);
            expect(result.timestamp).toBeDefined();
        });

        it('should return unhealthy status when not connected', async () => {
            RedisService.isConnected = false;

            const result = await RedisService.healthCheck();

            expect(result.status).toBe('unhealthy');
            expect(result.error).toBe('Not connected to Redis');
            expect(result.connected).toBe(false);
        });

        it('should return unhealthy status on ping error', async () => {
            RedisService.isConnected = true;
            mockClient.ping.mockRejectedValue(new Error('Ping failed'));

            const result = await RedisService.healthCheck();

            expect(result.status).toBe('unhealthy');
            expect(result.error).toBe('Ping failed');
            expect(result.connected).toBe(false);
        });
    });
});