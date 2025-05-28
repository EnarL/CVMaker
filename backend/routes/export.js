const express = require('express');
const sessionMiddleware = require('../middleware/session');

const router = express.Router();

router.use(['/pdf', '/word', '/preview', '/share'], sessionMiddleware.createOrGetSession);


module.exports = router;