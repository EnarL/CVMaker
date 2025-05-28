const { body, param } = require('express-validator');

const cvValidator = [
    body('personalInfo.fullName')
        .optional({ checkFalsy: true })
        .isLength({ min: 0, max: 100 })
        .withMessage('Full name must be less than 100 characters'),

    body('personalInfo.email')
        .optional({ checkFalsy: true })
        .custom((value) => {
            if (!value || value.trim() === '') return true; // Allow empty
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(value);
        })
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),

    body('personalInfo.phone')
        .optional({ checkFalsy: true })
        .isLength({ max: 20 })
        .withMessage('Phone number must be less than 20 characters'),

    body('personalInfo.location')
        .optional({ checkFalsy: true })
        .isLength({ max: 200 })
        .withMessage('Location must be less than 200 characters'),

    body('personalInfo.website')
        .optional({ checkFalsy: true })
        .custom((value) => {
            if (!value || value.trim() === '') return true; // Allow empty
            try {
                new URL(value);
                return true;
            } catch {
                return false;
            }
        })
        .withMessage('Please provide a valid website URL'),

    body('personalInfo.linkedin')
        .optional({ checkFalsy: true })
        .custom((value) => {
            if (!value || value.trim() === '') return true; // Allow empty
            try {
                new URL(value);
                return true;
            } catch {
                return false;
            }
        })
        .withMessage('Please provide a valid LinkedIn URL'),

    body('personalInfo.summary')
        .optional({ checkFalsy: true })
        .isLength({ max: 2000 })
        .withMessage('Summary must be less than 2000 characters'),

    // Template validation
    body('template')
        .optional({ checkFalsy: true })
        .isIn(['modern', 'classic', 'creative', 'minimal'])
        .withMessage('Template must be one of: modern, classic, creative, minimal'),

    // Arrays validation - Allow empty arrays
    body('experience')
        .optional()
        .isArray({ max: 50 })
        .withMessage('Experience must be an array with maximum 50 items'),

    body('education')
        .optional()
        .isArray({ max: 20 })
        .withMessage('Education must be an array with maximum 20 items'),

    body('skills')
        .optional()
        .isArray({ max: 100 })
        .withMessage('Skills must be an array with maximum 100 items'),

    body('projects')
        .optional()
        .isArray({ max: 50 })
        .withMessage('Projects must be an array with maximum 50 items'),


    // Nested array validations - only validate if items exist and have content
    body('experience.*.title')
        .optional({ checkFalsy: true })
        .isLength({ max: 200 })
        .withMessage('Job title must be less than 200 characters'),

    body('experience.*.company')
        .optional({ checkFalsy: true })
        .isLength({ max: 200 })
        .withMessage('Company must be less than 200 characters'),

    body('experience.*.duration')
        .optional({ checkFalsy: true })
        .isLength({ max: 100 })
        .withMessage('Duration must be less than 100 characters'),

    body('experience.*.description')
        .optional({ checkFalsy: true })
        .isLength({ max: 5000 })
        .withMessage('Description must be less than 5000 characters'),

    body('education.*.degree')
        .optional({ checkFalsy: true })
        .isLength({ max: 200 })
        .withMessage('Degree must be less than 200 characters'),

    body('education.*.school')
        .optional({ checkFalsy: true })
        .isLength({ max: 200 })
        .withMessage('School must be less than 200 characters'),

    body('education.*.year')
        .optional({ checkFalsy: true })
        .isLength({ max: 50 })
        .withMessage('Year must be less than 50 characters'),

    body('projects.*.name')
        .optional({ checkFalsy: true })
        .isLength({ max: 200 })
        .withMessage('Project name must be less than 200 characters'),

    body('projects.*.description')
        .optional({ checkFalsy: true })
        .isLength({ max: 2000 })
        .withMessage('Project description must be less than 2000 characters'),

    body('projects.*.technologies')
        .optional({ checkFalsy: true })
        .isLength({ max: 500 })
        .withMessage('Technologies must be less than 500 characters'),

    body('projects.*.link')
        .optional({ checkFalsy: true })
        .custom((value) => {
            if (!value || value.trim() === '') return true; // Allow empty
            try {
                new URL(value);
                return true;
            } catch {
                return false;
            }
        })
        .withMessage('Please provide a valid project URL'),

    body('skills.*.name')
        .optional({ checkFalsy: true })
        .isLength({ max: 100 })
        .withMessage('Skill name must be less than 100 characters'),

    body('skills.*.level')
        .optional({ checkFalsy: true })
        .isIn(['', 'Beginner', 'Intermediate', 'Advanced', 'Expert'])
        .withMessage('Skill level must be one of: Beginner, Intermediate, Advanced, Expert'),

    body('skills.*.category')
        .optional({ checkFalsy: true })
        .isLength({ max: 100 })
        .withMessage('Category must be less than 100 characters')
];

const sectionValidator = [
    param('section')
        .isIn(['personalInfo', 'experience', 'education', 'skills', 'projects', 'languages', 'certifications'])
        .withMessage('Invalid section name')
];
const experienceValidator = [
    body('title')
        .optional({ checkFalsy: true })
        .isLength({ min: 0, max: 200 })
        .withMessage('Job title must be less than 200 characters'),

    body('company')
        .optional({ checkFalsy: true })
        .isLength({ min: 0, max: 200 })
        .withMessage('Company must be less than 200 characters'),

    body('duration')
        .optional({ checkFalsy: true })
        .isLength({ max: 100 })
        .withMessage('Duration must be less than 100 characters'),

    body('location')
        .optional({ checkFalsy: true })
        .isLength({ max: 200 })
        .withMessage('Location must be less than 200 characters'),

    body('description')
        .optional({ checkFalsy: true })
        .isLength({ max: 5000 })
        .withMessage('Description must be less than 5000 characters')
];

const educationValidator = [
    body('degree')
        .optional({ checkFalsy: true })
        .isLength({ min: 0, max: 200 })
        .withMessage('Degree must be less than 200 characters'),

    body('school')
        .optional({ checkFalsy: true })
        .isLength({ min: 0, max: 200 })
        .withMessage('School must be less than 200 characters'),

    body('year')
        .optional({ checkFalsy: true })
        .isLength({ max: 50 })
        .withMessage('Year must be less than 50 characters'),

    body('location')
        .optional({ checkFalsy: true })
        .isLength({ max: 200 })
        .withMessage('Location must be less than 200 characters'),

    body('gpa')
        .optional({ checkFalsy: true })
        .isLength({ max: 20 })
        .withMessage('GPA must be less than 20 characters')
];

const projectValidator = [
    body('name')
        .optional({ checkFalsy: true })
        .isLength({ min: 0, max: 200 })
        .withMessage('Project name must be less than 200 characters'),

    body('description')
        .optional({ checkFalsy: true })
        .isLength({ max: 2000 })
        .withMessage('Description must be less than 2000 characters'),

    body('technologies')
        .optional({ checkFalsy: true })
        .isLength({ max: 500 })
        .withMessage('Technologies must be less than 500 characters'),

    body('link')
        .optional({ checkFalsy: true })
        .custom((value) => {
            if (!value || value.trim() === '') return true;
            try {
                new URL(value);
                return true;
            } catch {
                return false;
            }
        })
        .withMessage('Please provide a valid project URL'),

    body('duration')
        .optional({ checkFalsy: true })
        .isLength({ max: 100 })
        .withMessage('Duration must be less than 100 characters')
];

const skillValidator = [
    body('name')
        .optional({ checkFalsy: true })
        .isLength({ min: 0, max: 100 })
        .withMessage('Skill name must be less than 100 characters'),

    body('level')
        .optional({ checkFalsy: true })
        .isIn(['', 'Beginner', 'Intermediate', 'Advanced', 'Expert'])
        .withMessage('Skill level must be one of: Beginner, Intermediate, Advanced, Expert'),

    body('category')
        .optional({ checkFalsy: true })
        .isLength({ max: 100 })
        .withMessage('Category must be less than 100 characters')
];



module.exports = {
    cvValidator,
    sectionValidator,
    experienceValidator,
    educationValidator,
    projectValidator,
    skillValidator
};