const CVService = require('../services/cvService');
const redisService = require('../services/redisService');

// Mock Redis service
jest.mock('../services/redisService', () => ({
    saveCV: jest.fn(),
    getCV: jest.fn(),
    deleteCV: jest.fn()
}));

describe('CVService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('saveCV', () => {
        it('should save CV with sanitized data', async () => {
            const sessionId = 'test-session';
            const cvData = {
                personalInfo: {
                    fullName: '  John Doe  ',
                    email: 'john@example.com'
                }
            };

            redisService.saveCV.mockResolvedValue(true);

            const result = await CVService.saveCV(sessionId, cvData);

            expect(redisService.saveCV).toHaveBeenCalledWith(
                sessionId,
                expect.objectContaining({
                    personalInfo: {
                        fullName: 'John Doe',
                        email: 'john@example.com'
                    }
                })
            );
            expect(result.personalInfo.fullName).toBe('John Doe');
        });

        it('should handle Redis errors', async () => {
            const sessionId = 'test-session';
            const cvData = { personalInfo: {} };

            redisService.saveCV.mockRejectedValue(new Error('Redis error'));

            await expect(CVService.saveCV(sessionId, cvData)).rejects.toThrow('Redis error');
        });
    });

    describe('getCV', () => {
        it('should return CV data when exists', async () => {
            const sessionId = 'test-session';
            const mockCV = {
                personalInfo: { fullName: 'John Doe' },
                experience: []
            };

            redisService.getCV.mockResolvedValue(mockCV);

            const result = await CVService.getCV(sessionId);

            expect(redisService.getCV).toHaveBeenCalledWith(sessionId);
            expect(result).toEqual(mockCV);
        });

        it('should return empty template when CV does not exist', async () => {
            const sessionId = 'test-session';

            redisService.getCV.mockResolvedValue(null);

            const result = await CVService.getCV(sessionId);

            expect(result).toHaveProperty('personalInfo');
            expect(result).toHaveProperty('experience');
            expect(result).toHaveProperty('education');
            expect(result.template).toBe('modern');
        });
    });

    describe('deleteCV', () => {
        it('should delete CV successfully', async () => {
            const sessionId = 'test-session';

            redisService.deleteCV.mockResolvedValue(true);

            const result = await CVService.deleteCV(sessionId);

            expect(redisService.deleteCV).toHaveBeenCalledWith(sessionId);
            expect(result).toBe(true);
        });
    });

    describe('updateCVSection', () => {
        it('should update existing CV section', async () => {
            const sessionId = 'test-session';
            const section = 'personalInfo';
            const data = { fullName: 'Jane Doe' };
            const existingCV = {
                personalInfo: { fullName: 'John Doe' },
                experience: []
            };

            redisService.getCV.mockResolvedValue(existingCV);
            redisService.saveCV.mockResolvedValue(true);

            const result = await CVService.updateCVSection(sessionId, section, data);

            expect(result.personalInfo).toEqual(data);
            expect(result.lastUpdated).toBeDefined();
        });

        it('should create new CV if not exists', async () => {
            const sessionId = 'test-session';
            const section = 'personalInfo';
            const data = { fullName: 'Jane Doe' };

            redisService.getCV.mockResolvedValue(null);
            redisService.saveCV.mockResolvedValue(true);

            const result = await CVService.updateCVSection(sessionId, section, data);

            expect(result.personalInfo).toEqual(data);
            expect(result).toHaveProperty('experience');
        });
    });

    describe('addToSection', () => {
        it('should add item to existing section', async () => {
            const sessionId = 'test-session';
            const section = 'experience';
            const item = { title: 'Developer', company: 'Tech Corp' };
            const existingCV = {
                experience: [{ id: '1', title: 'Senior Dev' }]
            };

            redisService.getCV.mockResolvedValue(existingCV);
            redisService.saveCV.mockResolvedValue(true);

            const result = await CVService.addToSection(sessionId, section, item);

            expect(result).toHaveProperty('id');
            expect(result).toHaveProperty('createdAt');
            expect(result.title).toBe('Developer');
            expect(result.company).toBe('Tech Corp');
        });

        it('should create array if section does not exist', async () => {
            const sessionId = 'test-session';
            const section = 'experience';
            const item = { title: 'Developer' };
            const existingCV = {};

            redisService.getCV.mockResolvedValue(existingCV);
            redisService.saveCV.mockResolvedValue(true);

            const result = await CVService.addToSection(sessionId, section, item);

            expect(result).toHaveProperty('id');
            expect(result.title).toBe('Developer');
        });
    });

    describe('updateSectionItem', () => {
        it('should update existing item', async () => {
            const sessionId = 'test-session';
            const section = 'experience';
            const itemId = '1';
            const updatedData = { title: 'Updated Title' };
            const existingCV = {
                experience: [{ id: '1', title: 'Original Title', company: 'Corp' }]
            };

            redisService.getCV.mockResolvedValue(existingCV);
            redisService.saveCV.mockResolvedValue(true);

            const result = await CVService.updateSectionItem(sessionId, section, itemId, updatedData);

            expect(result.id).toBe('1');
            expect(result.title).toBe('Updated Title');
            expect(result.company).toBe('Corp'); // Should preserve existing fields
            expect(result.updatedAt).toBeDefined();
        });

        it('should create new item if not found', async () => {
            const sessionId = 'test-session';
            const section = 'experience';
            const itemId = '999';
            const updatedData = { title: 'New Title' };
            const existingCV = {
                experience: [{ id: '1', title: 'Existing' }]
            };

            redisService.getCV.mockResolvedValue(existingCV);
            redisService.saveCV.mockResolvedValue(true);

            const result = await CVService.updateSectionItem(sessionId, section, itemId, updatedData);

            expect(result.id).toBe('999');
            expect(result.title).toBe('New Title');
            expect(result.createdAt).toBeDefined();
        });
    });

    describe('upsertSectionItem', () => {
        it('should update existing item', async () => {
            const sessionId = 'test-session';
            const section = 'experience';
            const itemId = '1';
            const data = { title: 'Updated' };
            const existingCV = {
                experience: [{ id: '1', title: 'Original' }]
            };

            redisService.getCV.mockResolvedValue(existingCV);
            redisService.saveCV.mockResolvedValue(true);

            const result = await CVService.upsertSectionItem(sessionId, section, itemId, data);

            expect(result.title).toBe('Updated');
            expect(result.updatedAt).toBeDefined();
        });

        it('should create new item if not found', async () => {
            const sessionId = 'test-session';
            const section = 'experience';
            const itemId = '999';
            const data = { title: 'New Item' };
            const existingCV = { experience: [] };

            redisService.getCV.mockResolvedValue(existingCV);
            redisService.saveCV.mockResolvedValue(true);

            const result = await CVService.upsertSectionItem(sessionId, section, itemId, data);

            expect(result.title).toBe('New Item');
            expect(result.createdAt).toBeDefined();
        });
    });

    describe('removeFromSection', () => {
        it('should remove existing item', async () => {
            const sessionId = 'test-session';
            const section = 'experience';
            const itemId = '1';
            const existingCV = {
                experience: [
                    { id: '1', title: 'To Remove' },
                    { id: '2', title: 'To Keep' }
                ]
            };

            redisService.getCV.mockResolvedValue(existingCV);
            redisService.saveCV.mockResolvedValue(true);

            const result = await CVService.removeFromSection(sessionId, section, itemId);

            expect(result).toBe(true);
            expect(redisService.saveCV).toHaveBeenCalled();
        });

        it('should handle non-existent item gracefully', async () => {
            const sessionId = 'test-session';
            const section = 'experience';
            const itemId = '999';
            const existingCV = {
                experience: [{ id: '1', title: 'Item' }]
            };

            redisService.getCV.mockResolvedValue(existingCV);

            const result = await CVService.removeFromSection(sessionId, section, itemId);

            expect(result).toBe(true);
        });

        it('should handle non-existent section gracefully', async () => {
            const sessionId = 'test-session';
            const section = 'nonexistent';
            const itemId = '1';

            redisService.getCV.mockResolvedValue({});

            const result = await CVService.removeFromSection(sessionId, section, itemId);

            expect(result).toBe(true);
        });
    });

    describe('sanitizeCVData', () => {
        it('should trim and limit string lengths', () => {
            const data = {
                personalInfo: {
                    fullName: '  John Doe  ',
                    email: 'a'.repeat(2000) // Very long string
                }
            };

            const result = CVService.sanitizeCVData(data);

            expect(result.personalInfo.fullName).toBe('John Doe');
            expect(result.personalInfo.email.length).toBe(1000);
        });

        it('should limit array sizes', () => {
            const data = {
                skills: new Array(30).fill('skill') // More than limit of 20
            };

            const result = CVService.sanitizeCVData(data);

            expect(result.skills.length).toBe(20);
        });

        it('should sanitize nested objects in arrays', () => {
            const data = {
                experience: [{
                    title: '  Developer  ',
                    description: 'a'.repeat(2000)
                }]
            };

            const result = CVService.sanitizeCVData(data);

            expect(result.experience[0].title).toBe('Developer');
            expect(result.experience[0].description.length).toBe(1000);
        });
    });

    describe('validateCVData', () => {
        it('should return no errors for valid data', () => {
            const data = {
                personalInfo: {
                    email: 'john@example.com'
                }
            };

            const errors = CVService.validateCVData(data);

            expect(errors).toHaveLength(0);
        });

        it('should return error for invalid email', () => {
            const data = {
                personalInfo: {
                    email: 'invalid-email'
                }
            };

            const errors = CVService.validateCVData(data);

            expect(errors).toContain('Valid email is required');
        });

        it('should allow empty email', () => {
            const data = {
                personalInfo: {
                    email: ''
                }
            };

            const errors = CVService.validateCVData(data);

            expect(errors).toHaveLength(0);
        });
    });

    describe('isValidEmail', () => {
        it('should validate correct email formats', () => {
            expect(CVService.isValidEmail('test@example.com')).toBe(true);
            expect(CVService.isValidEmail('user.name@domain.co.uk')).toBe(true);
            expect(CVService.isValidEmail('user+tag@example.org')).toBe(true);
        });

        it('should reject invalid email formats', () => {
            expect(CVService.isValidEmail('invalid')).toBe(false);
            expect(CVService.isValidEmail('invalid@')).toBe(false);
            expect(CVService.isValidEmail('@example.com')).toBe(false);
            expect(CVService.isValidEmail('invalid.email')).toBe(false);
        });
    });

    describe('getEmptyCVTemplate', () => {
        it('should return complete CV template', () => {
            const template = CVService.getEmptyCVTemplate();

            expect(template).toHaveProperty('personalInfo');
            expect(template).toHaveProperty('experience');
            expect(template).toHaveProperty('education');
            expect(template).toHaveProperty('skills');
            expect(template).toHaveProperty('projects');
            expect(template).toHaveProperty('languages');
            expect(template).toHaveProperty('certifications');
            expect(template.template).toBe('modern');
            expect(template.createdAt).toBeDefined();
            expect(template.lastUpdated).toBeDefined();
        });

        it('should have default experience and education items with IDs', () => {
            const template = CVService.getEmptyCVTemplate();

            expect(template.experience[0]).toHaveProperty('id');
            expect(template.education[0]).toHaveProperty('id');
            expect(template.projects[0]).toHaveProperty('id');
        });
    });
});