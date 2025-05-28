const redisService = require('./redisService');

class CVService {
    // Create or update CV
    async saveCV(sessionId, cvData) {
        // Simple sanitization - just remove extreme values
        const sanitizedData = this.sanitizeCVData(cvData);

        // Save to Redis (with fallback)
        await redisService.saveCV(sessionId, sanitizedData);

        return sanitizedData;
    }

    // Get CV by session
    async getCV(sessionId) {
        const cvData = await redisService.getCV(sessionId);

        if (!cvData) {
            // Return empty CV template
            return this.getEmptyCVTemplate();
        }

        return cvData;
    }

    // Delete CV
    async deleteCV(sessionId) {
        await redisService.deleteCV(sessionId);
        return true;
    }

    // Update specific section
    async updateCVSection(sessionId, section, data) {
        // Get existing CV
        let cv = await redisService.getCV(sessionId);

        if (!cv) {
            cv = this.getEmptyCVTemplate();
        }

        // Update specific section
        cv[section] = data;
        cv.lastUpdated = new Date().toISOString();

        // Save back to Redis
        await redisService.saveCV(sessionId, cv);

        return cv;
    }

    // Add item to array section (experience, education, etc.)
    async addToSection(sessionId, section, item) {
        let cv = await redisService.getCV(sessionId);

        if (!cv) {
            cv = this.getEmptyCVTemplate();
        }

        if (!Array.isArray(cv[section])) {
            cv[section] = [];
        }

        // Add unique ID to item
        const newItem = {
            id: Date.now().toString(),
            ...item,
            createdAt: new Date().toISOString()
        };

        cv[section].push(newItem);
        cv.lastUpdated = new Date().toISOString();

        await redisService.saveCV(sessionId, cv);

        return newItem;
    }

    // Update item in array section - SIMPLIFIED VERSION
    async updateSectionItem(sessionId, section, itemId, updatedData) {
        let cv = await redisService.getCV(sessionId);

        if (!cv) {
            cv = this.getEmptyCVTemplate();
        }

        if (!Array.isArray(cv[section])) {
            cv[section] = [];
        }

        const itemIndex = cv[section].findIndex(item => item.id === itemId);

        if (itemIndex === -1) {
            // Create the item if it doesn't exist (no error throwing)
            const newItem = {
                id: itemId,
                ...updatedData,
                createdAt: new Date().toISOString()
            };

            cv[section].push(newItem);
            cv.lastUpdated = new Date().toISOString();

            await redisService.saveCV(sessionId, cv);
            return newItem;
        }

        // Update existing item
        cv[section][itemIndex] = {
            ...cv[section][itemIndex],
            ...updatedData,
            id: itemId, // Keep original ID
            updatedAt: new Date().toISOString()
        };

        cv.lastUpdated = new Date().toISOString();

        await redisService.saveCV(sessionId, cv);

        return cv[section][itemIndex];
    }

    // Remove item from array section
    async removeFromSection(sessionId, section, itemId) {
        let cv = await redisService.getCV(sessionId);

        if (!cv || !Array.isArray(cv[section])) {
            // Don't throw error, just return success
            return true;
        }

        cv[section] = cv[section].filter(item => item.id !== itemId);
        cv.lastUpdated = new Date().toISOString();
        await redisService.saveCV(sessionId, cv);

        return true;
    }

    // Get empty CV template
    getEmptyCVTemplate() {
        return {
            personalInfo: {
                fullName: '',
                email: '',
                phone: '',
                location: '',
                website: '',
                linkedin: '',
                summary: ''
            },
            experience: [{
                id: '1',
                title: '',
                company: '',
                duration: '',
                description: ''
            }],
            education: [{
                id: '1',
                degree: '',
                school: '',
                year: ''
            }],
            skills: [],
            projects: [{
                id: '1',
                name: '',
                description: '',
                technologies: '',
                link: ''
            }],
            languages: [],
            certifications: [],
            template: 'modern',
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
        };
    }

    // Minimal sanitization - just ensure we don't have extremely large data
    sanitizeCVData(data) {
        const sanitized = { ...data };

        // Simple string sanitization
        const sanitizeString = (str) => {
            if (typeof str !== 'string') return str;
            return str.substring(0, 10000); // Just prevent extremely large strings
        };

        // Sanitize personal info
        if (sanitized.personalInfo) {
            Object.keys(sanitized.personalInfo).forEach(key => {
                if (typeof sanitized.personalInfo[key] === 'string') {
                    sanitized.personalInfo[key] = sanitizeString(sanitized.personalInfo[key]);
                }
            });
        }

        // Sanitize arrays - just limit size
        ['experience', 'education', 'skills', 'projects', 'languages', 'certifications'].forEach(section => {
            if (Array.isArray(sanitized[section])) {
                sanitized[section] = sanitized[section].slice(0, 100); // Reasonable limit
                sanitized[section].forEach(item => {
                    if (typeof item === 'object' && item !== null) {
                        Object.keys(item).forEach(key => {
                            if (typeof item[key] === 'string') {
                                item[key] = sanitizeString(item[key]);
                            }
                        });
                    }
                });
            }
        });

        return sanitized;
    }

    // Minimal validation - only check for basic issues
    validateCVData(data) {
        const errors = [];

        // Only validate email if it's provided and not empty
        if (data.personalInfo?.email && data.personalInfo.email.trim() !== '') {
            if (!this.isValidEmail(data.personalInfo.email)) {
                errors.push('Valid email is required');
            }
        }

        return errors;
    }

    // Helper: Email validation
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

module.exports = new CVService();