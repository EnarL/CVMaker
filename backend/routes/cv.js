const express = require('express');
const cvController = require('../controllers/cvController');
const sessionMiddleware = require('../middleware/session');
const { cvValidator, sectionValidator } = require('../validators/cvValidator');

const router = express.Router();

router.use(sessionMiddleware.createOrGetSession);

router.get('/', cvController.getCV);

router.post('/', cvValidator, cvController.saveCV);
router.put('/', cvValidator, cvController.saveCV);

router.get('/template', cvController.getTemplate);

router.put('/section/:section', sectionValidator, cvController.updateSection);

router.post('/section/:section', cvController.addToSection);


router.put('/section/:section/:itemId', cvController.updateSectionItem);

router.delete('/section/:section/:itemId', cvController.removeFromSection);


router.delete('/', cvController.deleteCV);

module.exports = router;