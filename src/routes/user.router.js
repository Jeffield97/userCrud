const { getAll, login, register } = require('../controllers/user.controller');
const express = require('express');

const User = express.Router();

User.route('/')
    .get(getAll)
User.route('/register')
    .get(register)
User.route('/login')
    .get(login)
module.exports = User;