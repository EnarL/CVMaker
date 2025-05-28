const ExportService = require('../services/exportService');
const fs = require('fs').promises;


// Mock dependencies
jest.mock('fs', () => ({
    promises: {
        readFile: jest.fn()
    }
}));


describe('ExportService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('renderHTML', () => {
        const mockCVData = {
            personalInfo: {
                fullName: 'John Doe',
                email: 'john@example.com',
                phone: '123-456-7890'
            },
            experience: [{
                id: '1',
                title: 'Developer',
                company: 'Tech Corp',
                duration: '2020-2023',
                description: 'Built applications'
            }],
            education: [{
                id: '1',
                degree: 'BS Computer Science',
                school: 'University',
                year: '2020'
            }],
            skills: [
                { name: 'JavaScript', category: 'Programming' },
                { name: 'React', category: 'Frontend' }
            ]
        };

        it('should render HTML with custom template', async () => {
            const customTemplate = '<html><body>{{personalInfo.fullName}}</body></html>';
            fs.readFile.mockResolvedValue(customTemplate);

            const result = await ExportService.renderHTML(mockCVData, 'custom');

            expect(fs.readFile).toHaveBeenCalled();
            expect(result).toContain('John Doe');
        });

        it('should fallback to default template when file not found', async () => {
            fs.readFile.mockRejectedValue(new Error('File not found'));

            const result = await ExportService.renderHTML(mockCVData, 'modern');

            expect(result).toContain('John Doe');
            expect(result).toContain('Tech Corp');
        });
    });

    describe('processDataForTemplate', () => {
        it('should add helper flags for sections', () => {
            const cvData = {
                personalInfo: { fullName: 'John' },
                experience: [{ title: 'Dev' }],
                education: [],
                skills: [{ name: 'JS' }],
                projects: [],
            };

            const result = ExportService.processDataForTemplate(cvData);

            expect(result.hasExperience).toBe(true);
            expect(result.hasEducation).toBe(false);
            expect(result.hasSkills).toBe(true);
            expect(result.hasProjects).toBe(false);
        });

        it('should group skills by category', () => {
            const cvData = {
                skills: [
                    { name: 'JavaScript', category: 'Programming' },
                    { name: 'React', category: 'Frontend' },
                    { name: 'Node.js', category: 'Programming' },
                    { name: 'Python' } // No category
                ]
            };

            const result = ExportService.processDataForTemplate(cvData);

            expect(result.skillsByCategory).toHaveLength(3);
            expect(result.skillsByCategory.find(cat => cat.category === 'Programming').skills).toHaveLength(2);
            expect(result.skillsByCategory.find(cat => cat.category === 'General').skills).toHaveLength(1);
        });

        it('should add helper properties to experience items', () => {
            const cvData = {
                experience: [{
                    title: 'Developer',
                    description: 'Built apps',
                    location: 'NYC'
                }, {
                    title: 'Intern'
                }]
            };

            const result = ExportService.processDataForTemplate(cvData);

            expect(result.experience[0].hasDescription).toBe(true);
            expect(result.experience[0].hasLocation).toBe(true);
            expect(result.experience[1].hasDescription).toBe(false);
            expect(result.experience[1].hasLocation).toBe(false);
        });

        it('should handle missing sections gracefully', () => {
            const cvData = {
                personalInfo: { fullName: 'John' }
            };

            const result = ExportService.processDataForTemplate(cvData);

            expect(result.experience).toEqual([]);
            expect(result.education).toEqual([]);
            expect(result.skills).toEqual([]);
            expect(result.hasExperience).toBe(false);
        });
    });




});
