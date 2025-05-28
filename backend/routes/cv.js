const express = require('express');
const cvController = require('../controllers/cvController');
const sessionMiddleware = require('../middleware/session');
const { cvValidator, sectionValidator } = require('../validators/cvValidator');

const router = express.Router();

// Apply session middleware to all routes
router.use(sessionMiddleware.createOrGetSession);

// Get current CV
router.get('/', cvController.getCV);

// Save/Update entire CV
router.post('/', cvValidator, cvController.saveCV);
router.put('/', cvValidator, cvController.saveCV);

// Get empty CV template
router.get('/template', cvController.getTemplate);

// Update specific section
router.put('/section/:section', sectionValidator, cvController.updateSection);

// Add item to section arrays (experience, education, skills, etc.)
router.post('/section/:section', cvController.addToSection);

// Update specific item in section
router.put('/section/:section/:itemId', cvController.updateSectionItem);

// Remove item from section
router.delete('/section/:section/:itemId', cvController.removeFromSection);

// Delete entire CV
router.delete('/', cvController.deleteCV);

module.exports = router;