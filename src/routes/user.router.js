const { getAll, login, register, me, getOne, update, remove } = require('../controllers/user.controller');
const express = require('express');
const verifyJWT = require('../utils/VerifyJWT');

const User = express.Router();

User.route('/')
    .get(getAll)
// User.route('/register')
    .post(register)
User.route('/login')
    .post(login)
User.route('/me')
    .get(verifyJWT,me)
User.route('/:id')
    .get(getOne)
    .put(update)
    .delete(remove)
module.exports = User;