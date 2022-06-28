const authRouter = require('express').Router();
const { login, signup } = require('../controllers/authController');

authRouter.post('/login', login);

authRouter.post('/signup', signup);

module.exports = authRouter;