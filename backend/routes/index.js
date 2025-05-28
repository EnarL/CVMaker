const express = require('express');
const exportRoutes = require('./export');
const cvRoutes = require('./cv');

const router = express.Router();

router.use('/cv', cvRoutes);
router.use('/share', exportRoutes); // 👈 Duplicate mount, but works


router.get('/', (req, res) => {
    res.json({
        message: 'CV Maker API',
        version: '1.0.0',
        description: 'Session-based CV maker with PDF/Word export',
        endpoints: {
            cv: {
                description: 'CV management endpoints',
                routes: {
                    'GET /api/cv': 'Get current CV',
                    'POST /api/cv': 'Save/update CV',
                    'GET /api/cv/template': 'Get empty CV template',
                    'PUT /api/cv/section/:section': 'Update specific section',
                    'POST /api/cv/section/:section': 'Add item to section',
                    'PUT /api/cv/section/:section/:itemId': 'Update section item',
                    'DELETE /api/cv/section/:section/:itemId': 'Remove section item',
                    'DELETE /api/cv': 'Delete entire CV'
                }
            },
            export: {
                description: 'Export and sharing endpoints',
                routes: {
                    'GET /api/export/preview': 'Preview CV as HTML',
                    'GET /api/export/templates': 'Get available templates',
                    'POST /api/export/share': 'Generate shareable link',
                    'GET /api/export/share/:shareId': 'View shared CV'
                }
            }
        },
        features: [
            'Session-based storage (no authentication required)',
            'Real-time CV editing',
            'PDF export',
            'Multiple templates',
            'Shareable CV links',
            'Auto-save functionality'
        ]
    });
});

// Health check endpoint
router.get('/health', async (req, res) => {
    try {
        const redisService = require('../services/redisService');

        // Check Redis health
        const redisHealth = await redisService.healthCheck();

        // Get session stats
        const sessionStats = await redisService.getSessionStats();

        res.json({
            status: 'OK',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            redis: redisHealth,
            sessions: sessionStats
        });
    } catch (error) {
        res.status(503).json({
            status: 'Service Unavailable',
            timestamp: new Date().toISOString(),
            error: error.message
        });
    }
});

module.exports = router;