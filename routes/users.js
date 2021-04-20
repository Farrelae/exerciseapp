const express = require('express');
const router = express.Router();
const usersCtrl = require('../controllers/users');

router.get('/new', usersCtrl.new);
router.post('/signup', usersCtrl.signUp); // new route definition
router.get('/signin', usersCtrl.signIn); // new route definition
router.post('/login', usersCtrl.login); // new route definition 

module.exports = router;
