const redisService = require('./redisService');

class CVService {
    // Create or update CV
    async saveCV(sessionId, cvData) {
        // Validate and sanitize data
        const sanitizedData = this.sanitizeCVData(cvData);

        // Save to Redis
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

    // Update item in array section - IMPROVED VERSION
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
            // Instead of throwing an error, create the item if it doesn't exist
            console.log(`Item ${itemId} not found in ${section}, creating new item`);

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

    // ALTERNATIVE: Update or create item (upsert)
    async upsertSectionItem(sessionId, section, itemId, updatedData) {
        let cv = await redisService.getCV(sessionId);

        if (!cv) {
            cv = this.getEmptyCVTemplate();
        }

        if (!Array.isArray(cv[section])) {
            cv[section] = [];
        }

        const itemIndex = cv[section].findIndex(item => item.id === itemId);

        if (itemIndex === -1) {
            // Create new item
            const newItem = {
                id: itemId,
                ...updatedData,
                createdAt: new Date().toISOString()
            };
            cv[section].push(newItem);
        } else {
            // Update existing item
            cv[section][itemIndex] = {
                ...cv[section][itemIndex],
                ...updatedData,
                id: itemId,
                updatedAt: new Date().toISOString()
            };
        }

        cv.lastUpdated = new Date().toISOString();
        await redisService.saveCV(sessionId, cv);

        return cv[section][itemIndex === -1 ? cv[section].length - 1 : itemIndex];
    }

    // Remove item from array section
    async removeFromSection(sessionId, section, itemId) {
        let cv = await redisService.getCV(sessionId);

        if (!cv || !Array.isArray(cv[section])) {
            // Don't throw error, just return success
            console.log(`Section ${section} not found or not array, nothing to remove`);
            return true;
        }

        const originalLength = cv[section].length;
        cv[section] = cv[section].filter(item => item.id !== itemId);

        if (cv[section].length === originalLength) {
            console.log(`Item ${itemId} not found in ${section}, nothing to remove`);
            return true; // Don't treat as error
        }

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

    // Sanitize CV data
    sanitizeCVData(data) {
        const sanitized = { ...data };

        // Sanitize strings
        const sanitizeString = (str) => {
            if (typeof str !== 'string') return str;
            return str.trim().substring(0, 1000); // Limit length
        };

        // Sanitize personal info
        if (sanitized.personalInfo) {
            Object.keys(sanitized.personalInfo).forEach(key => {
                sanitized.personalInfo[key] = sanitizeString(sanitized.personalInfo[key]);
            });
        }

        // Sanitize arrays
        ['experience', 'education', 'skills', 'projects', 'languages', 'certifications'].forEach(section => {
            if (Array.isArray(sanitized[section])) {
                sanitized[section] = sanitized[section].slice(0, 20); // Limit array size
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

    // Validate CV data
    validateCVData(data) {
        const errors = [];

        // Don't require full name - allow empty CVs
        if (data.personalInfo?.email && !this.isValidEmail(data.personalInfo.email)) {
            errors.push('Valid email is required');
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