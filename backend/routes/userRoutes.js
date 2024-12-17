const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/me', authMiddleware, userController.getProfile);
router.put('/me', authMiddleware, userController.updateProfile);
router.put('/me/genealogy', authMiddleware, userController.updateGenealogy);
router.delete('/me', authMiddleware, userController.deleteProfile);

module.exports = router;